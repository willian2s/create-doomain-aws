export const AWS_CONFIG = {
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  REGION: process.env.AWS_REGION || "",
};

export const MESSAGES = {
  DOMAIN_REQUIRED: "O campo 'domain' é obrigatório.",
  HOSTED_ZONE_CREATED: "Zona hospedada criada com sucesso.",
  ERROR_CREATING_ZONE: "Erro ao criar a zona hospedada.",
  HOSTED_ZONE_NOT_FOUND: "Zona hospedada não encontrada.",
  HOSTED_ZONE_ID_REQUIRED: "O campo 'hostedZoneId' é obrigatório.",
  SHOPIFY_RECORD_CREATED: "Registro DNS para Shopify criado com sucesso.",
  ERROR_CREATING_SHOPIFY_RECORD: "Erro ao criar registro DNS para Shopify.",
  ERROR_ADD_DOMAIN: "Erro ao adicionar domínio ao Amplify.",
  DOMAIN_NOT_FOUND: "Domínio não encontrado.",
  SUCCESS_ADD_DOMAIN: "Domínio adicionado ao Amplify com sucesso.",
  SUCCESS_GET_CNAME: "CNAME obtido com sucesso.",
};
