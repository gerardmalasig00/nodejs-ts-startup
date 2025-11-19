import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

export default app;
