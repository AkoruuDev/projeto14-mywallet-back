import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import userRouter from "./routes/userRouter.js";
import walletRouter from "./routes/walletRouter.js";

const app = express();

// config
dotenv.config();
app.use(cors())
app.use(express.json());
const mongoClient = new MongoClient(process.env.MONGO_URI);
export let db;
const port = process.env.PORT || 2323;

try {
    await mongoClient.connect();
    db = mongoClient.db('mywallet-uu');
    console.log(`MongoDB connected on mywallet-uu db`);
} catch (err) {
    console.log(err);
}

const usersCollection = db.collection('users');
const historicCollection = db.collection('historic');
const logCollection = db.collection('session');

export { usersCollection, historicCollection, logCollection }

const validadeUserOnline = async () => {
        const newArray = await logCollection.find().toArray();
        console.log(newArray.length)
        /* newArray.forEach(async user => {
                await logCollection.deleteOne({ email: user.email });
        });*/
}

setInterval(() => {
        // validadeUserOnline()
}, 70000); // a cada 70 segundos

// routes
app.use(userRouter);
app.use(walletRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});