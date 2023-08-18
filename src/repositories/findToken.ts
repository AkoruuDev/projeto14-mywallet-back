import prisma from "../database/index.js"

async function findToken(token: string) {
    const promise = await prisma.sessions.findFirst({ where: {
        token
    }});

    return promise;
};

export {
    findToken,
}