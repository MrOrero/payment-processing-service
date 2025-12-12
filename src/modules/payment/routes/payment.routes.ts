import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { 
    createPaymentValidation, 
    getPaymentByIdValidation, 
    updatePaymentStatusValidation 
} from "../validation/payment.validation";


const paymentController = new PaymentController();
const router = Router();

router.post("/", createPaymentValidation(), paymentController.createPayment);
router.get("/:id", getPaymentByIdValidation(), paymentController.getPaymentById);
router.patch("/:id", updatePaymentStatusValidation(), paymentController.updatePaymentStatus);


export default router;
