import prisma from "../database/index.js";

async function deleteToken(token: string) {
    try {
        await prisma.sessions.delete({ where: {
            token
        }})
    } catch(e) {
        throw console.error(e)
    }
};

export {
    deleteToken,
}