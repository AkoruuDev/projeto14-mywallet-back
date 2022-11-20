import { newWalletSchema } from "../tools/JoiSchema.js";

export default function requestValidate (req, res, next) {
    const { title, description, value } = req.body;
    const { authorization } = req.headers;

    const { error } = newWalletSchema.validate({ title, value, authorization });
    if (error) {
        res.send(error.details.map(err => err.message))
    }

    next();
}