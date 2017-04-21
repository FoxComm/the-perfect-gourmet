import type { Localized } from 'lib/i18n';

type User = {
  aud: string,
  claims: Object,
  email: string,
  exp: number,
  id: number,
  iss: string,
  ratchet: number,
  roles: Array<any>,
  scope: string,
};

export type Auth = {
  user: User,
  jwt: string,
  previousLocation?: string,
};

export type RestorePasswordFormProps = Localized & {
  topMessage: string,
  title: string,
  t: (value: string) => string, // find where it comes from, signature
  restorePassword: Function, // signature here
};
