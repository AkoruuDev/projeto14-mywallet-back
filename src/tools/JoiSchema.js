import Joi from "joi";

const userSchema = Joi.object({
    email: Joi
            .string()
            .email()
            .required(),
    password: Joi
            .string()
            .min(8)
            .max(30)
            .required()
}).options({ abortEarly: false });

const registerSchema = Joi.object({
    name: Joi
            .string()
            .min(3)
            .required(),
    email: Joi
            .string()
            .email()
            .required(),
    password: Joi
            .string()
            .min(8)
            .max(30)
            .required()
}).options({ abortEarly: false });

const newWalletSchema = Joi.object({
    value: Joi
            .number()
            .required(),
    title: Joi
            .string()
            .required()
            .min(2),
    description: Joi
            .string(),
    authorization: Joi
            .string()
            .required()
}).options({ abortEarly: false });

const walletSchema = Joi.object({
    authorization: Joi
            .string()
            .required()
}).options({ abortEarly: false });

export { userSchema, registerSchema, newWalletSchema, walletSchema }