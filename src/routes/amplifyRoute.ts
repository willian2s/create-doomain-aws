import { Router, Request, Response } from "express";
import AmplifyService from "../services/amplifyService"; // Importar a classe
import { MESSAGES } from "../constants";

const router = Router();
const amplifyService = new AmplifyService(); // Instanciar a classe

// Rota para adicionar um domínio ao AWS Amplify
router.post("/add-domain", async (req: Request, res: Response) => {
  const { appId, domainName, subDomain } = req.body;

  try {
    await amplifyService.addDomain(appId, domainName, subDomain); // Chamar o método da classe
    res.status(201).json({ message: MESSAGES.SUCCESS_ADD_DOMAIN });
  } catch (error) {
    res.status(400).json({ message: MESSAGES.ERROR_ADD_DOMAIN, error });
  }
});

export default router;
