import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { PaymentService } from "../services/payment.service";
import { formatValidationError } from "../../../libs/helpers/utils";

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(formatValidationError(errors.array()));
            }

            const { amount, customerEmail, description, customerName } = req.body;

            const payment = await this.paymentService.createPayment({
                amount,
                customerEmail,
                description,
                customerName
            });

            res.status(201).json({
                success: true,
                message: "Payment created successfully",
                data: payment
            });
        } catch (error) {
            next(error);
        }
    };
}
