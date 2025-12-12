import { PaymentStatus } from "../../../libs/constants";
import { nanoid } from "nanoid";

export class Payment {
    id: string;
    amount: number;
    status: PaymentStatus;
    description?: string;
    customerEmail: string;
    customerName?: string;
    createdAt: Date;
    updatedAt: Date;
    processedAt?: Date;
    failureReason?: string;

    constructor(
        amount: number,
        customerEmail: string,
        description?: string,
        customerName?: string
    ) {
        this.id = this.generateId();
        this.amount = amount;
        this.status = PaymentStatus.PENDING;
        this.customerEmail = customerEmail;
        this.description = description;
        this.customerName = customerName;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    private generateId(): string {
        return nanoid(10);
    }

    updateStatus(status: PaymentStatus, failureReason?: string): void {
        this.status = status;
        this.updatedAt = new Date();
        
        if (status === PaymentStatus.COMPLETED || status === PaymentStatus.FAILED) {
            this.processedAt = new Date();
        }
        
        if (status === PaymentStatus.FAILED && failureReason) {
            this.failureReason = failureReason;
        }
    }
}