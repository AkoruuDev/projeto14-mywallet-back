import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { usersCollection, logCollection } from "../app.js";
import { userSchema, registerSchema } from "../tools/JoiSchema.js";

export async function signIn (req, res) { // return userList without password { name, email, token }
    const { email } = req.body;
    const token = uuid();

    try {
        const user = await usersCollection.findOne({ email });
        await logCollection.insertOne({ token, userId: user._id});
        res.status(200).send({ token, email, name: user.name });
        return;
    } catch (err) {
        res.status(500).send('Erro ao fazer login')
    }
};

export async function signUp(req, res) {
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

    const bcpass = bcrypt.hashSync(password, 10);

    try {
        await usersCollection.insertOne({ name, password: bcpass, email });
        res.status(201).send('Usuario cadastrado com sucesso')
    } catch (err) {
        res.status(500).send('Erro ao fazer registro')
    }
};

export async function logoff(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    const user = await logCollection.findOne({ token });
    user.delete()
    res.status(200).send('Usuário deslogado com sucesso');
};