import { Request, Response } from "express";
import httpStatus from "http-status";
import prisma from "../database/index.js";
import jwt from "jsonwebtoken";

export async function signIn (_req: Request, res: Response) {
    const { email, id } = res.locals;
    const token = jwt.sign({ id }, process.env.JWT_HASH, { expiresIn: 846000 })

    try {
        const user = await prisma.users.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send('Usuário não encontrado');
        }

        await prisma.sessions.create({
            data: {
                token,
                user_id: user.id
            }
        });

        return res.status(httpStatus.OK).send({ token, email, name: user.name });
    } catch (err) {
        console.error("Erro:", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Erro ao fazer login');
    }
};

function SignUp(req: Request, res: Response) {
    return res.status(httpStatus.OK).send("OK")
};

function LogOff(req: Request, res: Response) {
    return res.status(httpStatus.OK).send("OK")
};