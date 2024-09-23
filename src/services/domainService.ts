// src/services/domainService.ts

import {
  Route53Client,
  CreateHostedZoneCommand,
  GetHostedZoneCommand,
  ChangeResourceRecordSetsCommand,
} from "@aws-sdk/client-route-53";
import { v4 as uuidv4 } from "uuid";
import { AWS_CONFIG } from "../constants";

class DomainService {
  private route53Client: Route53Client;

  constructor() {
    this.route53Client = new Route53Client({
      region: AWS_CONFIG.REGION,
      credentials: {
        accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY,
      },
    });
  }

  // Método para criar a zona hospedada
  async createHostedZone(domain: string): Promise<string> {
    try {
      const createCommand = new CreateHostedZoneCommand({
        CallerReference: uuidv4(),
        Name: domain,
      });

      const createResponse = await this.route53Client.send(createCommand);

      if (!createResponse.HostedZone?.Id) {
        throw new Error("Falha ao criar a zona hospedada.");
      }

      return createResponse.HostedZone.Id; // Retorna apenas o ID da zona criada
    } catch (error) {
      console.error("Erro ao criar a zona hospedada:", error);
      throw error;
    }
  }

  // Método para verificar se a zona hospedada está ativa
  async verifyHostedZone(
    hostedZoneId: string
  ): Promise<{ NameServers: string[]; HostedZoneId: string }> {
    try {
      const getCommand = new GetHostedZoneCommand({ Id: hostedZoneId });
      const getResponse = await this.route53Client.send(getCommand);

      if (!getResponse.DelegationSet?.NameServers) {
        throw new Error("Zona hospedada não encontrada ou não está ativa.");
      }

      return {
        NameServers: getResponse.DelegationSet.NameServers,
        HostedZoneId: hostedZoneId,
      };
    } catch (error) {
      console.error("Erro ao verificar a zona hospedada:", error);
      throw error;
    }
  }

  // Método para criar um registro DNS para a loja Shopify
  async createShopifyRecord(
    domain: string,
    hostedZoneId: string,
    shopifyDomain: string
  ): Promise<void> {
    const recordType = "CNAME"; // Ou "A" dependendo de como você deseja configurar

    const changeResourceRecordSetsCommand = new ChangeResourceRecordSetsCommand(
      {
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
          Changes: [
            {
              Action: "CREATE",
              ResourceRecordSet: {
                Name: domain,
                Type: recordType,
                TTL: 300,
                ResourceRecords: [
                  {
                    Value: shopifyDomain, // Usar o domínio fornecido da Shopify
                  },
                ],
              },
            },
          ],
        },
      }
    );

    try {
      await this.route53Client.send(changeResourceRecordSetsCommand);
      console.log(
        `Registro DNS criado para ${domain} apontando para ${shopifyDomain}`
      );
    } catch (error) {
      console.error("Erro ao criar registro DNS para a loja Shopify:", error);
      throw error;
    }
  }
}

export default DomainService;
