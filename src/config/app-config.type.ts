export type AppConfig = {
  apiPrefix: string;
  backendDomain: string;
  fallbackLanguage: string;
  frontendDomain?: string;
  headerLanguage: string;
  name: string;
  nodeEnv: string;
  port: number;
  workingDirectory: string;
};
