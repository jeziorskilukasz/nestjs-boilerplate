export type HashTypes = 'confirmEmail' | 'forgotPassword' | 'changeEmail';

export const HashEnums: { [key in HashTypes]: string } = {
  confirmEmail: 'confirmEmailUserId',
  forgotPassword: 'forgotPasswordUserId',
  changeEmail: 'changeEmailUserId',
};
