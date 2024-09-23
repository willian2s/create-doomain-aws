// src/app.ts

import express from "express";
import dotenv from "dotenv";
import domainRoutes from "./routes/domainRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/domains", domainRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
