import { Router } from "express";
import { logoff, signIn, signUp } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post('/sign-in', signIn);
userRouter.post('/sign-up', signUp);
userRouter.delete('logoff', logoff);

export default userRouter;