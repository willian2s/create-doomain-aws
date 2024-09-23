// src/routes/domainRoutes.ts

import { Router, Request, Response } from "express";
import DomainService from "../services/domainService";
import { MESSAGES } from "../constants";

const router = Router();
const domainService = new DomainService();

// Rota para criar domínio
router.post("/create-domain", async (req: Request, res: Response) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ message: MESSAGES.DOMAIN_REQUIRED });
  }

  try {
    const hostedZoneId = await domainService.createHostedZone(domain);
    res.status(201).json({
      message: MESSAGES.HOSTED_ZONE_CREATED,
      hostedZoneId: hostedZoneId,
    });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.ERROR_CREATING_ZONE, error });
  }
});

// Rota para verificar a disponibilidade da zona hospedada
router.get(
  "/check-domain/:hostedZoneId",
  async (req: Request, res: Response) => {
    const { hostedZoneId } = req.params;

    try {
      const dnsInfo = await domainService.verifyHostedZone(hostedZoneId);
      res.status(200).json({
        message: "Zona hospedada está ativa.",
        hostedZoneId: dnsInfo.HostedZoneId,
        nameServers: dnsInfo.NameServers,
      });
    } catch (error) {
      res.status(404).json({ message: MESSAGES.HOSTED_ZONE_NOT_FOUND, error });
    }
  }
);

// Rota para criar um registro DNS para Shopify
router.post("/create-shopify-record", async (req: Request, res: Response) => {
  const { domain, hostedZoneId, shopifyDomain } = req.body; // Adicione 'shopifyDomain'

  if (!domain || !hostedZoneId || !shopifyDomain) {
    // Verifique se todos os parâmetros são fornecidos
    return res.status(400).json({ message: MESSAGES.HOSTED_ZONE_ID_REQUIRED });
  }

  try {
    await domainService.createShopifyRecord(
      domain,
      hostedZoneId,
      shopifyDomain
    ); // Passe o domínio da Shopify
    res.status(201).json({ message: MESSAGES.SHOPIFY_RECORD_CREATED });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_CREATING_SHOPIFY_RECORD, error });
  }
});

export default router;
