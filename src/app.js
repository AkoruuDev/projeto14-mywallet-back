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
const port = process.env.PORT || 2323;
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

const newWalletSchema = Joi.object({
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

const walletSchema = Joi.object({
    authorization: Joi
            .string()
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
        res.status(409).send('Este usuário já está logado');
        return;
    }

    try {
        const bcpass = bcrypt.compareSync(password, user.password);
        console.log(user.password)
        console.log(password)
        console.log(bcpass);
        if (email && bcpass) {
            res.status(200).send(user);
            return;
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

    const token = 'Bearer 73657821238902231211';

    try {
        const bcpass = bcrypt.hashSync(password, 10);

        await usersCollection.insertOne({ name, password: bcpass, email, token });
        await walletSchema.insertOne({ name, email, token, wallet: {} });
        res.status(201).send('Usuario cadastrado com sucesso')
    } catch (err) {
        res.status(500).send('Erro ao mandar registo para o servidor')
    }
});

app.get('/historic', async (req, res) => {
    const { authorization } = req.headers;

    const { error } = walletSchema.validate({ authorization });
    if (error) {
        res.status(422).send(error.details.map(err => err.message));
        return;
    }

    const token = authorization.replace('Bearer ', '');

    try {
        const list = await historicCollection.findOne({ token });
        res.status(200).send(list);
    } catch (err) {
        res.status(500).send('Erro ao encontrar carteira do usuário');
    }
});

app.post('/input', async (req, res) => {
    const { title, description, value } = req.body;
    const { authorization } = req.headers;

    const { error } = newWalletSchema.validate({ title, description, value, authorization });

    if (error) {
        res.send(error.details.map(err => err.message))
    }

    const money = Number(value);
    const token = authorization.replace('Bearer ', '');

    try {
        const item = await historicCollection.findOne({ token });
        await item.wallet.insertOne({ title, description, money, isInput: true });
    
        res.status(201).send('Salvo com sucesso')
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/output', async (req, res) => {
    const { title, description, value } = req.body;
    const { authorization } = req.headers;

    const { error } = newWalletSchema.validate({ title, description, value, authorization });

    if (error) {
        res.send(error.details.map(err => err.message))
    }

    const money = Number(value);
    const token = authorization.replace('Bearer ', '');

    try {
        const item = await historicCollection.findOne({ token });
        await item.wallet.insertOne({ title, description, money, isInput: false });
    
        res.status(201).send('Salvo com sucesso')
    } catch (err) {
        res.status(500).send(err);
    }

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});