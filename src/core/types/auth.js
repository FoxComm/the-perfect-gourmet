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
