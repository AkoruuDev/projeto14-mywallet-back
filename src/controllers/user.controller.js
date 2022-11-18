import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { usersCollection, logCollection } from "../app.js";
import { userSchema, walletSchema, registerSchema } from "../app.js";

export async function signIn (req, res) { // return userList without password { name, email, token }
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
};

export async function signUp(req, res) { // add token
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
};

export async function logoff(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    const user = await logCollection.findOne({ token });
    user.delete()
    res.status(200).send('Usuário deslogado com sucesso');
};