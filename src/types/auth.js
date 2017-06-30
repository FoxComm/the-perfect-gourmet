import type { Localized } from 'lib/i18n/index';

export type User = {
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
};

export type RestorePasswordFormProps = Localized & {
  topMessage: string,
  title: string,
  t: (value: string) => string,
  restorePassword: (email: string) => Promise<*>,
};

export type SignUpPayload = {
  name: string,
  email: string,
  password: string,
};

export type LoginPayload = {
  email: string,
  password: string,
  kind: string,
};
