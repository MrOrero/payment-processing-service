import { Payment } from "../entity/payment.entity";
import { PaymentStatus } from "../../../libs/constants";

export class PaymentRepository {
    private payments: Payment[] = [];

    create(payment: Payment): Payment {
        this.payments.push(payment);
        return payment;
    }

    findById(id: string): Payment | null {
        return this.payments.find(payment => payment.id === id) || null;
    }

    updateStatus(id: string, status: PaymentStatus, failureReason?: string): Payment | null {
        const payment = this.findById(id);
        if (!payment) {
            return null;
        }
        
        payment.updateStatus(status, failureReason);
        return payment;
    }
}
