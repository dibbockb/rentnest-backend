import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors"
import envConfig from "./config/envConfig";

const app: Application = express()

app.use(cors({ origin: envConfig.app_url, credentials: true }))
app.use(express.json());

app.get(`/`, (req: Request, res: Response) => {
    res.send(`Server is Running...`)
})

export default app;