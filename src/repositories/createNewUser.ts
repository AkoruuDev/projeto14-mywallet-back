import prisma from "../database/index.js";

function createNewUser(name: string, email: string, password: string) {
    const data = {
        name,
        email,
        password,
    }
    prisma.users.create({ data })
}

export {
    createNewUser,
}