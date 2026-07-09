import express, { Application, Request, Response } from "express";
import cors from "cors"
import envConfig from "./config/envConfig";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { authRoutes } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import { propertiesRoutes } from "./modules/properties/properties.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { landlordRoutes } from "./modules/landlord/landlord.route";
import { rentalRoutes } from "./modules/rental/rental.routes";
import { paymentRoutes } from "./modules/payment/payment.route";

const app: Application = express()

app.use(`/api/payments/webhook`, express.raw({ type: 'application/json' }))
app.use(cors({ origin: envConfig.app_url, credentials: true }))
app.use(express.json());
app.use(cookieParser())

app.get(`/`, (req: Request, res: Response) => {
    res.send(`Server is Running...`)
})

app.use(`/api/admin`, adminRoutes)
app.use(`/api/auth`, authRoutes)
app.use(`/api/properties`, propertiesRoutes)
app.use(`/api/landlord`, landlordRoutes)
app.use(`/api/rental`, rentalRoutes)
app.use(`/api/payments`, paymentRoutes)

app.use(globalErrorHandler)
app.use(notFoundHandler)
export default app;