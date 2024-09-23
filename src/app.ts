// src/app.ts

import express from "express";
import dotenv from "dotenv";
import domainRoutes from "./routes/domainRoutes";
import amplifyRoutes from "./routes/amplifyRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/domains", domainRoutes);
app.use("/api/v1/amplify", amplifyRoutes); // Rota para Amplify

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
