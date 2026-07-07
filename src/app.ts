import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors"
import envConfig from "./config/envConfig";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { authRoutes } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import { propertiesRoutes } from "./modules/properties/properties.route";
import { adminRoutes } from "./modules/admin/admin.route";

const app: Application = express()

app.use(cors({ origin: envConfig.app_url, credentials: true }))
app.use(express.json());
app.use(cookieParser())

app.get(`/`, (req: Request, res: Response) => {
    res.send(`Server is Running...`)
})

app.use(`/api/auth`, authRoutes)
app.use(`/api/properties`, propertiesRoutes)
app.use(`/api/admin`, adminRoutes)

app.use(globalErrorHandler)
app.use(notFoundHandler)
export default app;