export type AuthConfig = {
  confirmEmailExpires?: string;
  confirmEmailSecret?: string;
  expires?: string;
  forgotExpires?: string;
  forgotSecret?: string;
  changeEmailExpires?: string;
  changeEmailSecret?: string;
  refreshExpires?: string;
  refreshSecret?: string;
  secret: string;
};
