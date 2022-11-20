import { Router } from "express";
import { logoff, signIn, signUp } from "../controllers/user.controller.js";
import signInValidate from "../middleware/signInValidate.js";
import signUpValidate from "../middleware/signUpValidate.js";

const userRouter = Router();

userRouter.post('/sign-in', signInValidate, signIn);
userRouter.post('/sign-up', signUpValidate, signUp);
userRouter.delete('logoff', logoff);

export default userRouter;