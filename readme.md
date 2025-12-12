## Payment Processing Service API

### Overview

This project is a lightweight payment processing simulator built with Node.js, Express, and TypeScript. It exposes endpoints for creating payments, retrieving payment, and updating the status (e.g., marking a payment as `COMPLETED` or `FAILED`). Data is stored in memory via a simple repository so the service is easy to run locally, and asynchronous status updates are simulated to mimic a gateway processing delay. Swagger documentation ships with the service at `/docs`.

### Tech Stack

- Node.js 18+
- Express + Helmet
- TypeScript
- express-validator for request validation
- Swagger UI for interactive docs
- Jest + ts-jest for unit testing

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9

Verify versions:

```shell
node -v
npm -v
```

### Installation & Local Development

1. Install dependencies:

        ```shell
        npm install
        ```

2. Start the server using either development watch mode **or** the compiled build:

     - Watch mode (auto reload):

         ```shell
         npm run start:dev
         ```

     - Build & run the compiled output:

         ```shell
         npm run build
         npm start
         ```

3. Visit `http://localhost:3000/docs` (or your chosen port) for the interactive Swagger UI.

## Testing

Unit tests live alongside the source (`src/modules/payment/**/*.spec.ts`). Run them with:

```shell
npm test
```

## API Reference

Base URL: `http://localhost:3000/api/payment`

| Method | Endpoint    | Description                                                |
| ------ | ----------- | ---------------------------------------------------------- |
| POST   | `/`         | Create a payment (initially `PENDING`, async processing).  |
| GET    | `/:id`      | Retrieve a payment by id.                                  |
| PATCH  | `/:id`      | Manually update the status and optional failure reason.    |

### Create Payment `POST /api/payment`

```json
{
    "amount": 125.75,
    "customerEmail": "buyer@example.com",
    "customerName": "Jane Doe",
    "description": "Subscription renewal"
}
```

Validation:

- `amount` must be a positive number.
- `customerEmail` must be a valid email.
- `customerName` and `description` are optional but must be non-empty strings when provided.

Response `201 Created`:

```json
{
    "success": true,
    "message": "Payment created successfully",
    "data": {
        "id": "PAY123",
        "amount": 125.75,
        "status": "PENDING",
        "customerEmail": "buyer@example.com",
        "customerName": "Jane Doe",
        "description": "Subscription renewal",
        "createdAt": "2023-09-24T10:00:00.000Z",
        "updatedAt": "2023-09-24T10:00:00.000Z"
    }
}
```

### Get Payment `GET /api/payment/:id`

Returns the most recent representation of the payment. Responds with `404` when the id is unknown.

### Update Status `PATCH /api/payment/:id`

```json
{
    "status": "FAILED",
    "failureReason": "Card declined"
}
```

Rules:

- `status` must be one of `PENDING`, `COMPLETED`, `FAILED`.
- `failureReason` is optional, but encouraged when setting `FAILED`.

Successful response mirrors the payment payload; missing ids return `404`.

## Documentation

- Swagger UI: `http://localhost:3000/docs`
- The OpenAPI spec lives in `src/libs/swagger/swagger.config.ts` and auto-loads on server start.

## Notes

- Persistence is in-memory only; restart wipes all payments. Swap `PaymentRepository` with a database-backed implementation for production scenarios.
- `PaymentService` simulates async gateway processing by randomly promoting `PENDING` payments to `COMPLETED` or `FAILED` after a short delay.