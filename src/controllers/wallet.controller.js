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
        const id = user.UserId;
        const list = await historicCollection.findOne({ id });

        res.status(200).send(list);
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

    const money = Number(value);
    const token = authorization.replace('Bearer ', '');

    try {
        const item = await historicCollection.findOne({ token });
        await item.wallet.insertOne({ title, description, money, isInput: true });
    
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

    const money = Number(value);
    const token = authorization.replace('Bearer ', '');

    try {
        const item = await historicCollection.findOne({ token });
        await item.wallet.insertOne({ title, description, money, isInput: false });
    
        res.status(201).send('Salvo com sucesso')
    } catch (err) {
        res.status(500).send(err);
    }

};