import { PaymentService } from "../services/payment.service";
import { PaymentRepository } from "../repository/payment.repository";
import { Payment } from "../entity/payment.entity";
import { PaymentStatus } from "../../../libs/constants";
import { CustomError } from "../../../libs/errors/custom-error";

jest.mock("nanoid", () => ({
    nanoid: jest.fn(() => "test-payment")
}));

type PaymentRepositoryMock = jest.Mocked<PaymentRepository>;

describe("PaymentService", () => {
    let paymentService: PaymentService;
    let paymentRepositoryMock: PaymentRepositoryMock;

    beforeEach(() => {
        jest.clearAllMocks();

        paymentRepositoryMock = {
            create: jest.fn(),
            findById: jest.fn(),
            updateStatus: jest.fn()
        } as unknown as PaymentRepositoryMock;

        paymentService = new PaymentService(paymentRepositoryMock);
    });

    it("creates a payment and triggers async processing", async () => {
        const dto = {
            amount: 100,
            customerEmail: "customer@example.com",
            description: "Initial order",
            customerName: "Jane Doe"
        };
        const savedPayment = new Payment(dto.amount, dto.customerEmail, dto.description, dto.customerName);

        paymentRepositoryMock.create.mockReturnValue(savedPayment);

        const processSpy = jest
            .spyOn(paymentService as unknown as { processPayment(payment: Payment): Promise<Payment> }, "processPayment")
            .mockResolvedValue(savedPayment);

        const result = await paymentService.createPayment(dto);

        expect(paymentRepositoryMock.create).toHaveBeenCalledTimes(1);
        expect(result).toBeInstanceOf(Payment);
        expect(result).toMatchObject({
            amount: dto.amount,
            customerEmail: dto.customerEmail,
            description: dto.description,
            customerName: dto.customerName,
            status: PaymentStatus.PENDING
        });
        expect(processSpy).toHaveBeenCalledWith(savedPayment);
        expect(result).toBe(savedPayment);

        processSpy.mockRestore();
    });

    it("returns a payment when found by id", async () => {
        const payment = new Payment(50, "user@example.com");
        paymentRepositoryMock.findById.mockReturnValue(payment);

        await expect(paymentService.getPaymentById(payment.id)).resolves.toBe(payment);
        expect(paymentRepositoryMock.findById).toHaveBeenCalledWith(payment.id);
    });

    it("throws a 404 CustomError when payment is missing", async () => {
        paymentRepositoryMock.findById.mockReturnValue(null);

        await expect(paymentService.getPaymentById("missing-id")).rejects.toBeInstanceOf(CustomError);
        await expect(paymentService.getPaymentById("missing-id")).rejects.toMatchObject({
            message: "Payment not found",
            statusCode: 404
        });
    });

    it("updates payment status through the repository", async () => {
        const payment = new Payment(80, "status@example.com");
        paymentRepositoryMock.updateStatus.mockReturnValue(payment);

        const updated = await paymentService.updatePaymentStatus(payment.id, PaymentStatus.COMPLETED);

        expect(paymentRepositoryMock.updateStatus).toHaveBeenCalledWith(payment.id, PaymentStatus.COMPLETED, undefined);
        expect(updated).toBe(payment);
    });

    it("throws a 404 CustomError when updating a non-existent payment", async () => {
        paymentRepositoryMock.updateStatus.mockReturnValue(null);
        
        await expect(
            paymentService.updatePaymentStatus("non-existent", PaymentStatus.FAILED, "Card declined")
        ).rejects.toBeInstanceOf(CustomError);
        await expect(
            paymentService.updatePaymentStatus("non-existent", PaymentStatus.FAILED, "Card declined")
        ).rejects.toMatchObject({
            message: "Payment not found",
            statusCode: 404
        });
    });
});
