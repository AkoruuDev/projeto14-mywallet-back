export default function requestValidate (req, res, next) {
    const { title, description, value } = req.body;
    const { authorization } = req.headers;

    const { error } = newWalletSchema.validate({ title, description, value, authorization });
    if (error) {
        res.send(error.details.map(err => err.message))
    }

    next();
}