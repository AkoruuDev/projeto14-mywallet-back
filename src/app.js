import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import Joi from "joi";
import bcrypt from "bcrypt";

const app = express();

// config
dotenv.config();
app.use(express.json());
const mongoClient = new MongoClient(process.env.MONGO_URI);
const port = process.env.PORT;
let db;

// connect
try {
    await mongoClient.connect();
    db = mongoClient.db('mywallet-uu');
    console.log(`MongoDB connected on mywallet-uu db`);
} catch (err) {
    console.log(err);
}

// collections
const usersCollection = db.collection('users');
const historicCollection = db.collection('historic');

// joi verify
const userSchema = Joi.object({
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

const registerSchema = Joi.object({
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

const walletSchema = Joi.object({
    value: Joi
            .number()
            .required(),
    description: Joi
            .string()
            .min(1)
            .required()
}).options({ abortEarly: false });

// routes
app.post('/sign-in', async (req, res) => { // return userList without password { name, email, token }
    const { email, password } = req.body;

    const { error } = userSchema.validate({ email, password });

    if (error) {
        res.status(422).send(error.details.map(error => error.message));
        return;
    }

    const user = await usersCollection.findOne({ email });

    if (user) {
        res.status(409).send('Este usuário já está logado')
    }

    try {
        const bcpass = bcrypt.compareSync(user.password, password);
        
        if (email && bcpass) {
            await usersCollection.insertOne({ email, password });
            res.status(200).send('Usuario logado com sucesso');
        }
    } catch (err) {
        res.status(500).send('Erro ao salvar informações no banco de dados')
    }
});

app.post('/sign-up', async (req, res) => { // add token
    const { name, email, password } = req.body;

    const { error } = registerSchema.validate({ name, email, password });

    if (error) {
        res.status(422).send(error.details.map(error => error.message));
        return;
    }

    const registerExists = await usersCollection.findOne({ email });

    if (registerExists) {
        res.status(422).send('Este email já está cadastrado');
        return;
    }

    try {
        await usersCollection.insertOne({ name, password, email });
        res.status(201).send('Usuario cadastrado com sucesso')
    } catch (err) {
        res.status(500).send('Erro ao mandar registo para o servidor')
    }
});

app.get('/historic', (req, res) => {

});

app.post('/input', (req, res) => {

});

app.post('/output', (req, res) => {

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});