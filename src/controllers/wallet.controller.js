import dayjs from "dayjs";
import { walletSchema, newWalletSchema } from "../app.js";
import { historicCollection, usersCollection, logCollection } from "../app.js";

export async function historic(req, res) {
    const { authorization } = req.headers;

    const { error } = walletSchema.validate({ authorization });
    if (error) {
        res.status(422).send(error.details.map(err => err.message));
        return;
    }

    const token = authorization.replace('Bearer ', '');

    try {
        const user = await logCollection.findOne({ token });
        const response = await historicCollection.find().toArray();
        const historicUser = response.filter(item => String(item.userId) === String(user.userId))

        res.status(200).send(historicUser);
    } catch (err) {
        res.status(500).send('Erro ao encontrar carteira do usuário');
    }
};

export async function input(req, res) {
    const { title, description, value } = req.body;
    const { authorization } = req.headers;

    const { error } = newWalletSchema.validate({ title, description, value, authorization });

    if (error) {
        res.send(error.details.map(err => err.message))
    }

    const token = authorization.replace('Bearer ', '');

    try {
        const user = await logCollection.findOne({ token });
        console.log(user);
        const date = {
            date: dayjs().format('DD/MM'),
            fullDate: dayjs().format('DD/MM/YYYY'),
            time: dayjs().format('HH:mm'),
            weekDay: dayjs().format('dddd')
        }
        historicCollection.insertOne({ title, description, value, userId: user.userId, isInput: true, date });
        console.log(await historicCollection.find().toArray())
    
        res.status(201).send('Salvo com sucesso')
    } catch (err) {
        res.status(500).send(err);
    }
};

export async function output(req, res) {
    const { title, description, value } = req.body;
    const { authorization } = req.headers;

    const { error } = newWalletSchema.validate({ title, description, value, authorization });

    if (error) {
        res.send(error.details.map(err => err.message))
    }

    const token = authorization.replace('Bearer ', '');

    try {
        const user = await logCollection.findOne({ token });
        console.log(user);
        const date = {
            date: dayjs().format('DD/MM'),
            fullDate: dayjs().format('DD/MM/YYYY'),
            time: dayjs().format('HH:mm'),
            weekDay: dayjs().format('dddd')
        }
        historicCollection.insertOne({ title, description, value: `-${value}`, userId: user.userId, isInput: false, date });
        console.log(await historicCollection.find().toArray())
    
        res.status(201).send('Salvo com sucesso')
    } catch (err) {
        res.status(500).send(err);
    }
};