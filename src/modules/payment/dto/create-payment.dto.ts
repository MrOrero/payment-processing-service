export interface CreatePaymentDto {
    amount: number;
    customerEmail: string;
    description?: string;
    customerName?: string;
}
