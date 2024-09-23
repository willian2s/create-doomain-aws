// src/services/amplifyService.ts

import {
  AmplifyClient,
  CreateDomainAssociationCommand,
} from "@aws-sdk/client-amplify";
import { AWS_CONFIG } from "../constants";

class AmplifyService {
  private amplifyClient: AmplifyClient;

  constructor() {
    this.amplifyClient = new AmplifyClient({
      region: AWS_CONFIG.REGION,
      credentials: {
        accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY,
      },
    });
  }

  async addDomain(
    appId: string,
    domainName: string,
    subDomain: { branchName: string; prefix: string }
  ): Promise<void> {
    try {
      const command = new CreateDomainAssociationCommand({
        appId: appId,
        domainName: domainName,
        subDomainSettings: [subDomain],
      });

      const response = await this.amplifyClient.send(command);
      console.log("Domínio associado com sucesso:", response);

      // Verifique os registros DNS que precisam ser configurados
      if (response.domainAssociation) {
        const { domainName, subDomains } = response.domainAssociation;

        console.log(
          `Configuração DNS necessária para o domínio ${domainName}:`
        );
        subDomains?.forEach((sub: any) => {
          console.log(
            `- CNAME para ${sub.prefix}.${domainName}: ${sub.domainStatus}`
          );
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar domínio:", error);
      throw error; // Re-lançar erro para manipulação na rota
    }
  }
}

export default AmplifyService;
