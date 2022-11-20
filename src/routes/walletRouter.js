import { Router } from "express";
import { historic, input, output } from "../controllers/wallet.controller.js";

const walletRouter = Router();

walletRouter.get('/historic', historic);
walletRouter.post('/input', input);
walletRouter.post('/output', output);

export default walletRouter;