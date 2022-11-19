import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import Joi from "joi";
import { logoff, signIn, signUp } from "./controllers/user.controller.js";
import { historic, input, output } from "./controllers/wallet.controller.js";

const app = express();

// config
dotenv.config();
app.use(cors())
app.use(express.json());
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
const port = process.env.PORT || 2323;

try {
    await mongoClient.connect();
    db = mongoClient.db('mywallet-uu');
    console.log(`MongoDB connected on mywallet-uu db`);
} catch (err) {
    console.log(err);
}

// collections
export const usersCollection = db.collection('users');
export const historicCollection = db.collection('historic');
export const logCollection = db.collection('session');

const validadeUserOnline = async () => {
        const newArray = await logCollection.find().toArray();
        console.log(newArray.length)
        console.log(newArray)
        /* newArray.forEach(async user => {
                await logCollection.deleteOne({ email: user.email });
        });*/
}

setInterval(() => {
        // validadeUserOnline()
}, 70000); // a cada 70 segundos

// joi verify
export const userSchema = Joi.object({
    email: Joi
            .string()
            .email()
            .required(),
    password: Joi
            .string()
            .min(8)
            .max(30)
            .required()
}).options({ abortEarly: false });

export const registerSchema = Joi.object({
    name: Joi
            .string()
            .min(3)
            .required(),
    email: Joi
            .string()
            .email()
            .required(),
    password: Joi
            .string()
            .min(8)
            .max(30)
            .required()
}).options({ abortEarly: false });

export const newWalletSchema = Joi.object({
    value: Joi
            .number()
            .required(),
    title: Joi
            .string()
            .required()
            .min(2),
    description: Joi
            .string(),
    authorization: Joi
            .string()
            .required()
}).options({ abortEarly: false });

export const walletSchema = Joi.object({
    authorization: Joi
            .string()
            .required()
}).options({ abortEarly: false });

// routes
app.post('/sign-in', signIn);
app.post('/sign-up', signUp);

app.get('/historic', historic);
app.post('/input', input);
app.post('/output', output);

app.delete('/logoff', logoff);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});