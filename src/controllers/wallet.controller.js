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
        const list = response.filter(item => item.userId === user.userId);

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

    const token = authorization.replace('Bearer ', '');

    try {
        const user = await logCollection.findOne({ token });
        console.log(user);
        historicCollection.insertOne({ title, description, value, userId: user.userId, isInput: true });
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
        historicCollection.insertOne({ title, description, value, userId: user.userId, isInput: false });
        console.log(await historicCollection.find().toArray())
    
        res.status(201).send('Salvo com sucesso')
    } catch (err) {
        res.status(500).send(err);
    }
};