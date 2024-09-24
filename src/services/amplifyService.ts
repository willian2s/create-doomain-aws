import {
  AmplifyClient,
  CreateDomainAssociationCommand,
  ListDomainAssociationsCommand,
  SubDomain,
  SubDomainSetting,
} from "@aws-sdk/client-amplify";
import { AWS_CONFIG } from "../constants";

type DNSRecorder = {
  subDomainName: string | undefined;
  cname: string | undefined;
};
type AddDomainResponse = {
  status: string | undefined;
  dnsRecorder: DNSRecorder[] | undefined;
};

type AddDomain = {
  appId: string;
  domainName: string;
  subDomain: SubDomainSetting;
};

type GetCname = Omit<AddDomain, "subDomain">;

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

  async addDomain({
    appId,
    domainName,
    subDomain,
  }: AddDomain): Promise<AddDomainResponse | undefined> {
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
        subDomains?.forEach((sub: SubDomain) => {
          console.log(
            `- CNAME para ${sub.subDomainSetting?.prefix}.${domainName}: ${sub.dnsRecord}`
          );
        });

        return {
          status: response?.domainAssociation?.domainStatus,
          dnsRecorder: subDomains?.map((sub: SubDomain) => ({
            subDomainName: sub.subDomainSetting?.prefix,
            cname: sub.dnsRecord,
          })),
        };
      }
    } catch (error) {
      console.error("Erro ao adicionar domínio:", error);
      throw error; // Re-lançar erro para manipulação na rota
    }
  }

  async getCnameForSubdomain({
    appId,
    domainName,
  }: GetCname): Promise<AddDomainResponse | undefined> {
    try {
      const command = new ListDomainAssociationsCommand({
        appId: appId,
      });

      const data = await this.amplifyClient.send(command);

      const domainAssociation = data.domainAssociations?.find(
        (association) => association.domainName === domainName
      );

      if (domainAssociation) {
        return {
          status: domainAssociation?.domainStatus,
          dnsRecorder: domainAssociation.subDomains?.map((subDomain) => ({
            subDomainName: subDomain.subDomainSetting?.prefix,
            cname: subDomain.dnsRecord,
          })),
        };
      } else {
        throw new Error("Domínio não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao obter o CNAME:", error);
      throw error;
    }
  }
}

export default AmplifyService;
