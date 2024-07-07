require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const authRoutes = require('./Routes/AuthRoutes');
const userRoutes = require('./Routes/UserRoutes');

app.use('/api/auth/', authRoutes);
app.use('/api/users/', userRoutes);


const PORT = process.env.PORT || 5003;
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { dbName: 'ChatGPT' })
    .then(() => {
        console.log('Connected to MongoDB.');
        app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
    })
    .catch((error) => {
        console.log('Could not connect to MongoDB.');
        console.log(error);
    });