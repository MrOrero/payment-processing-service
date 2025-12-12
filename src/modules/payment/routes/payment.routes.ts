import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { createPaymentValidation } from "../validation/payment.validation";


const paymentController = new PaymentController();
const router = Router();

router.post("/", createPaymentValidation(), paymentController.createPayment);


export default router;
