import { Router } from "express";
import { LogOff, SignUp, signIn } from "../controllers/users.controllers.js";

const route = Router();

route
    .post('/sign-in', signIn)
    //POST /api/auth/sign-in - Login user with email and password. Returns JWT
    .post('/sign-up', SignUp)
    // POST /api/auth/signup - Register a new account for the application
    .delete('/logoff', LogOff)
    // DELETE /api/auth/logout - Log off current session (JWT token).

export {
    route as userRouter,
}