import {
  AmplifyClient,
  CreateDomainAssociationCommand,
  GetDomainAssociationCommand,
  DeleteDomainAssociationCommand,
  SubDomain,
  SubDomainSetting,
} from "@aws-sdk/client-amplify";
import { AWS_CONFIG } from "../constants";

type DNSRecorder = {
  subDomainName: string | undefined;
  type: string | undefined;
  value: string | undefined;
};
type AddDomainResponse = {
  status: string | undefined;
  dnsRecorder: DNSRecorder[] | undefined;
  certificateVerificationDNSRecord: DNSRecorder | undefined;
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

        const [subDomainName, type, value] =
          response?.domainAssociation?.certificateVerificationDNSRecord?.split(
            " "
          ) || [];

        return {
          status: response?.domainAssociation?.domainStatus,
          certificateVerificationDNSRecord: {
            subDomainName: subDomainName || "",
            type: type || "",
            value: value || "",
          },
          dnsRecorder: subDomains?.map((sub: SubDomain) => {
            const [subDomainName, type, value] =
              sub.dnsRecord?.split(" ") || [];

            return {
              subDomainName: subDomainName || "",
              type: type || "",
              value: value || "",
            };
          }),
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
      const command = new GetDomainAssociationCommand({
        appId: appId,
        domainName: domainName,
      });

      const response = await this.amplifyClient.send(command);
      console.log(response.domainAssociation);

      if (response.domainAssociation) {
        const { domainName, subDomains } = response.domainAssociation;

        console.log(
          `Configuração DNS necessária para o domínio ${domainName}:`
        );
        subDomains?.forEach((sub: SubDomain) => {
          console.log(
            `- CNAME para ${sub.subDomainSetting?.prefix}.${domainName}: ${sub.dnsRecord}`
          );
          console.log(sub);
          console.log(sub.dnsRecord?.split(" "));
        });

        const [subDomainName, type, value] =
          response?.domainAssociation?.certificateVerificationDNSRecord?.split(
            " "
          ) || [];

        return {
          status: response?.domainAssociation?.domainStatus,
          certificateVerificationDNSRecord: {
            subDomainName: subDomainName || "",
            type: type || "",
            value: value || "",
          },
          dnsRecorder: subDomains?.map((sub: SubDomain) => {
            const [subDomainName, type, value] =
              sub.dnsRecord?.split(" ") || [];

            return {
              subDomainName: subDomainName || "",
              type: type || "",
              value: value || "",
            };
          }),
        };
      }
    } catch (error) {
      console.error("Erro ao obter o CNAME:", error);
      throw error;
    }
  }
}

export default AmplifyService;
