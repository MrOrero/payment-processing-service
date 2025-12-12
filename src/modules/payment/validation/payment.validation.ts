import { body, param } from "express-validator";
import { PaymentStatus } from "../../../libs/constants";

export const createPaymentValidation = () => [
    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Amount must be a number")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than 0"),
    
    body("customerEmail")
        .notEmpty()
        .withMessage("Customer email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
    
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")
        .notEmpty()
        .withMessage("Description cannot be empty")
        .trim(),
    
    body("customerName")
        .optional()
        .isString()
        .withMessage("Customer name must be a string")
        .notEmpty()
        .withMessage("Customer name cannot be empty")
        .trim()
];

export const getPaymentByIdValidation = () => [
    param("id")
        .notEmpty()
        .withMessage("Payment ID is required")
        .isString()
        .withMessage("Payment ID must be a string")
];

export const updatePaymentStatusValidation = () => [
    param("id")
        .notEmpty()
        .withMessage("Payment ID is required")
        .isString()
        .withMessage("Payment ID must be a string"),
    
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(Object.values(PaymentStatus))
        .withMessage("Invalid payment status, status must be one of: " + Object.values(PaymentStatus).join(", ")),
    
    body("failureReason")
        .optional()
        .isString()
        .withMessage("Failure reason must be a string")
        .trim()
];
