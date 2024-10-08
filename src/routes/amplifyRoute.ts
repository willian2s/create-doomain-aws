import { Router, Request, Response } from "express";
import AmplifyService from "../services/amplifyService"; // Importar a classe
import { MESSAGES } from "../constants";

const router = Router();
const amplifyService = new AmplifyService(); // Instanciar a classe

// Rota para adicionar um domínio ao AWS Amplify
router.post("/domain", async (req: Request, res: Response) => {
  const { appId, domainName, subDomain } = req.body;

  try {
    const response = await amplifyService.addDomain({
      appId,
      domainName,
      subDomain,
    }); // Chamar o método da classe

    res.status(201).json({
      message: MESSAGES.SUCCESS_ADD_DOMAIN,
      ...response,
    });
  } catch (error) {
    res.status(400).json({ message: MESSAGES.ERROR_ADD_DOMAIN, error });
  }
});

router.get(
  "/domain/:appId/:domainName",
  async (req: Request, res: Response) => {
    const { appId, domainName } = req.params;

    try {
      const response = await amplifyService.getCnameForSubdomain({
        appId,
        domainName,
      }); // Chamar o método da classe

      res.status(201).json({
        message: MESSAGES.SUCCESS_GET_CNAME,
        ...response,
      });
    } catch (error) {
      res.status(400).json({ message: MESSAGES.DOMAIN_NOT_FOUND, error });
    }
  }
);

router.delete(
  "/domain/:appId/:domainName",
  async (req: Request, res: Response) => {
    const { appId, domainName } = req.params;

    try {
      const response = await amplifyService.deleteDomain({ appId, domainName });

      res
        .status(200)
        .json({ message: MESSAGES.SUCCESS_DELETE_DOMAIN, ...response });
    } catch (error) {
      res.status(400).json({ message: MESSAGES.ERROR_DELETE_DOMAIN, error });
    }
  }
);

export default router;
