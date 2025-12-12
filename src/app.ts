import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./libs/middlewares/error-handler";
import paymentRoutes from "./modules/payment/routes/payment.routes";
import { swaggerDocument } from "./libs/swagger/swagger.config";

const app = express();

app.use(express.json());
app.use(helmet());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/payment", paymentRoutes);
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
