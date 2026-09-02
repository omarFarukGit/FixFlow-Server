import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

const app: Application = express();

const swaggerPath = path.join(process.cwd(), "swagger.yml");
const file = fs.readFileSync(swaggerPath, "utf-8");
const swaggerDocument = YAML.parse(file);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello fixflow-server!");
});

export default app;
