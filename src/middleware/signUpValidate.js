import { registerSchema } from "../tools/JoiSchema.js";
import { usersCollection } from "../app.js";

export default async function signUpValidate(req, res, next) {
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

    next();
}