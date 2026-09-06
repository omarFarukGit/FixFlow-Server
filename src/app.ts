import fs from "node:fs";
import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { authRoutes } from "./app/module/auth/auth.route";
import { categoryRoutes } from "./app/module/category/category.route";
import { technicianRoute } from "./app/module/technician/technician.route";
import { userRoute } from "./app/module/user/user.route";

const app: Application = express();

const swaggerPath = path.join(process.cwd(), "swagger.yml");
const file = fs.readFileSync(swaggerPath, "utf-8");
const swaggerDocument = YAML.parse(file);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello fixflow-server!");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/technicians", technicianRoute);
app.use("/api/v1/categories", categoryRoutes);
app.use(globalErrorHandler);
app.use(notFound);
export default app;
