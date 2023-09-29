export enum UserScopes {
  Unverified = 'UNVERIFIED',
  Uninitialized = 'UNINITIALIZED',
  User = 'USER',
  Admin = 'ADMIN',
}

export interface IUser {
  id: string
  email: string
  // no password
  name?: string
  role: UserScopes
}