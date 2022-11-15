import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

const app = express();

// config
dotenv.config();
app.use(express.json());
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

// connect
try {
    await mongoClient.connect();
    db = mongoClient.db('mywallet.uu');
    console.log(`MongoDB connected on mywallet.uu db`);
} catch (err) {
    console.log(err);
}

// collections
const usersCollection = db.collection('users');
const historicCollection = db.collection('historic');

// routes
app.post('/sign-in', (req, res) => {

});

app.post('/sign-up', (req, res) => {

});

app.get('/historic', (req, res) => {

});

app.post('/input', (req, res) => {

});

app.post('/output', (req, res) => {

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});