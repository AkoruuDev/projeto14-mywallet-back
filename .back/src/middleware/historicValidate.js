import { walletSchema } from "../tools/JoiSchema.js";

export default async function historicValidate(req, res, next) {
    const { authorization } = req.headers;

    const { error } = walletSchema.validate({ authorization });
    if (error) {
        res.status(422).send(error.details.map(err => err.message));
        return;
    }

    next();
}