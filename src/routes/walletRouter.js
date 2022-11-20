import { Router } from "express";
import { historic, input, output } from "../controllers/wallet.controller.js";
import { historicValidate, requestValidate } from "../middleware/middlewares.js";

const walletRouter = Router();

walletRouter.get('/historic', historicValidate, historic);
walletRouter.post('/input', requestValidate, input);
walletRouter.post('/output', requestValidate, output);

export default walletRouter;