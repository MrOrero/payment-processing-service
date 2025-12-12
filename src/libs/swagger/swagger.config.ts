export const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Payment Processing Service API",
        version: "1.0.0",
        description: "Simple service that simulates payment processing operations."
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local server"
        }
    ],
    tags: [
        {
            name: "Payments",
            description: "Operations for creating and managing payments"
        }
    ],
    paths: {
        "/api/payment": {
            post: {
                tags: ["Payments"],
                summary: "Create a payment",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["amount", "customerEmail"],
                                properties: {
                                    amount: {
                                        type: "number",
                                        example: 120.5
                                    },
                                    customerEmail: {
                                        type: "string",
                                        format: "email",
                                        example: "user@example.com"
                                    },
                                    customerName: {
                                        type: "string",
                                        example: "Jane Doe"
                                    },
                                    description: {
                                        type: "string",
                                        example: "Subscription payment"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Payment created",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaymentResponse"
                                }
                            }
                        }
                    },
                    422: {
                        description: "Validation failed"
                    }
                }
            }
        },
        "/api/payment/{id}": {
            get: {
                tags: ["Payments"],
                summary: "Get payment by id",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Payment details",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaymentResponse"
                                }
                            }
                        }
                    },
                    404: {
                        description: "Payment not found"
                    }
                }
            },
            patch: {
                tags: ["Payments"],
                summary: "Update payment status",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["status"],
                                properties: {
                                    status: {
                                        type: "string",
                                        enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"],
                                        example: "COMPLETED"
                                    },
                                    failureReason: {
                                        type: "string",
                                        example: "Insufficient funds"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Payment updated",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaymentResponse"
                                }
                            }
                        }
                    },
                    404: {
                        description: "Payment not found"
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            PaymentResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Payment" }
                }
            },
            Payment: {
                type: "object",
                properties: {
                    id: { type: "string", example: "PAY-9B2K8LEM" },
                    amount: { type: "number", example: 99.99 },
                    status: {
                        type: "string",
                        enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"],
                        example: "PENDING"
                    },
                    customerEmail: { type: "string", format: "email" },
                    customerName: { type: "string" },
                    description: { type: "string" },
                    failureReason: { type: "string", nullable: true },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    processedAt: { type: "string", format: "date-time", nullable: true }
                }
            }
        }
    }
};
