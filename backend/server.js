require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./Routes/AuthRoutes');

app.use('/api/auth/', authRoutes);


const PORT = process.env.PORT || 5003;
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB.');
        app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
    })
    .catch((error) => {
        console.log('Could not connect to MongoDB.');
        console.log(error);
    });