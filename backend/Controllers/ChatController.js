const OpenAI = require('openai');
const Thread = require('../Models/Thread');

const model = 'gpt-3.5-turbo';
const n = 1;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

console.log('Connected to OpenAI.');

const completeTitle = async (prompt) => {
    const completion = await openai.chat.completions.create({
        model: model,
        n: n,
        messages: [{
            role: 'user',
            content: `Provide a relevant title for the following prompt in 5 words or less: "${prompt}"`,
        }],
    });

    return completion.choices[0].message.content;
}

const completeNext = async (thread) => {
    const completion = await openai.chat.completions.create({
        model: model,
        n: n,
        messages: thread.messages,
    });

    return {
        created: completion.created * 1000,
        role: 'assistant',
        content: completion.choices[0].message.content,
    };
}

const createThread = async (req, res) => {
    const { prompt } = req.body;

    const title = await completeTitle(prompt);

    let thread = await Thread.create({
        userId: req.user._id,
        title: title,
        messages: [{
            created: Date.now(),
            role: 'user',
            content: prompt,
        }]
    })
        .catch(() => null);

    if(!thread)
        return res.status(500).json({ error: 'Could not create thread.' });

    thread = await Thread.findByIdAndUpdate(thread._id, {
        $push: {
            messages: await completeNext(thread),
        },
    }, { new: true })
        .catch(() => null);

    if(!thread)
        return res.status(500).json({ error: 'Unable to complete prompt.' });

    res.status(200).json({ thread: thread });
}

const completePrompt = async (req, res) => {
    const { threadId, prompt } = req.body;

    let thread = await Thread.findByIdAndUpdate(threadId, {
        $push: {
            messages: {
                created: Date.now(),
                role: 'user',
                content: prompt,
            },
        },
    }, { new: true})
        .catch(() => null)

    if(!thread)
        return res.status(500).json({ error: 'Unable to parse prompt.' });

    thread = await Thread.findByIdAndUpdate(thread._id, {
        $push: {
            messages: await completeNext(thread),
        },
    }, { new: true })
        .catch(() => null);

    if(!thread)
        return res.status(500).json({ error: 'Unable to complete prompt.' });

    res.status(200).json({ thread: thread });
};

const changeTitle = async (req, res) => {
    const { threadId, title } = req.body;

    const thread = await Thread.findByIdAndUpdate(threadId, { title: title }, { new: true})
        .catch(() => null);

    if(!thread)
        return res.status(500).json({ error: 'Could not update thread.' });

    res.status(200).json({ thread: thread });
}

module.exports = { test, createThread, completePrompt, changeTitle };