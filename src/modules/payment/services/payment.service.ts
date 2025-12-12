import { CreatePaymentDto } from "../dto/create-payment.dto";
import { Payment } from "../entity/payment.entity";
import { PaymentRepository } from "../repository/payment.repository";
import { PaymentStatus } from "../../../libs/constants/constants";
import { CustomError } from "../../../libs/errors/custom-error";

export class PaymentService {
    private paymentRepository: PaymentRepository;

    constructor() {
        this.paymentRepository = new PaymentRepository();
    }

    async createPayment(dto: CreatePaymentDto): Promise<Payment> {
        try {
            const payment = new Payment(
                dto.amount,
                dto.customerEmail,
                dto.description,
                dto.customerName
            );

            const savedPayment = this.paymentRepository.create(payment);

            // this is to simulate asynchronous payment processing,
            // initially a payment is created with PENDING status
            // and after some time its status is updated
            this.processPayment(savedPayment);

            return savedPayment;
        } catch (error) {
            throw error;
        }
    }

    private async processPayment(payment: Payment): Promise<Payment> {
        try {
            const delay = Math.floor(Math.random() * 2000) + 1000;
            await new Promise(resolve => setTimeout(resolve, delay));

            const possibleStatuses = [
                PaymentStatus.COMPLETED,
                PaymentStatus.FAILED,
                PaymentStatus.PENDING
            ];
            
            const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
            
            const failureReasons = [
                "Insufficient funds",
                "Card declined",
                "Payment gateway timeout",
                "Invalid card details"
            ];
            
            const failureReason = randomStatus === PaymentStatus.FAILED 
                ? failureReasons[Math.floor(Math.random() * failureReasons.length)]
                : undefined;

            payment.updateStatus(randomStatus, failureReason);
            
            return payment;
        } catch (error) {
            throw error;
        }
    }

    async getPaymentById(id: string): Promise<Payment> {
        try {
            const payment = this.paymentRepository.findById(id);
            if (!payment) {
                throw new CustomError("Payment not found", 404);
            }
            return payment;
        } catch (error) {
            throw error;
        }
    }

    async updatePaymentStatus(
        id: string, 
        status: PaymentStatus, 
        failureReason?: string
    ): Promise<Payment> {
        try {
            const payment = this.paymentRepository.updateStatus(id, status, failureReason);
            if (!payment) {
                throw new CustomError("Payment not found", 404);
            }
            return payment;
        } catch (error) {
            throw error;
        }
    }
}
