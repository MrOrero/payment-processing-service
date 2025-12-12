import { body } from "express-validator";

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
