import { Router, Request, Response } from "express";
import AmplifyService from "../services/amplifyService"; // Importar a classe
import { MESSAGES } from "../constants";

const router = Router();
const amplifyService = new AmplifyService(); // Instanciar a classe

// Rota para adicionar um domínio ao AWS Amplify
router.post("/add-domain", async (req: Request, res: Response) => {
  const { appId, domainName, subDomain } = req.body;

  try {
    const response = await amplifyService.addDomain({
      appId,
      domainName,
      subDomain,
    }); // Chamar o método da classe

    res.status(201).json({
      message: MESSAGES.SUCCESS_ADD_DOMAIN,
      dnsRecorder: response,
    });
  } catch (error) {
    res.status(400).json({ message: MESSAGES.ERROR_ADD_DOMAIN, error });
  }
});

router.get(
  "/verify-domain/:appId/:domainName",
  async (req: Request, res: Response) => {
    const { appId, domainName } = req.params;

    try {
      const response = await amplifyService.getCnameForSubdomain({
        appId,
        domainName,
      }); // Chamar o método da classe

      res.status(201).json({
        message: MESSAGES.SUCCESS_GET_CNAME,
        dnsRecorder: response,
      });
    } catch (error) {
      res.status(400).json({ message: MESSAGES.DOMAIN_NOT_FOUND, error });
    }
  }
);

export default router;
