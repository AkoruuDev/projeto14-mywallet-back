import { userSchema } from "../tools/JoiSchema";
import bcrypt from "bcrypt";

export default async function signInValidate(req, res, next) {
    const { email, password } = req.body;

    const { error } = userSchema.validate({ email, password });
    if (error) {
        res.status(422).send(error.details.map(error => error.message));
        return;
    }

    const user = await logCollection.findOne({ email });
    if (user) {
        res.status(409).send('Este usuário já está logado em outro dispositivo');
        return;
    }

    const userExists = await usersCollection.findOne({ email });
    if (!userExists) {
        res.status(401).send('Usuário inexistente')
    }

    const bcpass = bcrypt.compareSync(password, userExists.password);
    if (!bcpass) {
        res.status(401).send('Senha Incorreta')
    }

    next();
}