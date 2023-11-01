import Address from './address';
import Photo from './photo';

export enum UserScopes {
  Unverified = 'UNVERIFIED',
  Uninitialized = 'UNINITIALIZED',
  User = 'USER',
  Admin = 'ADMIN',
}

export interface IUser {
  _id: string;
  authId: string;
  email: string;
  name: string;
  role: UserScopes;
  homeAddressId: string | null;
  shippingAddressId: string | null;
  profilePicId: string | null;
  currentJobId: string | null;
  fcmTokens: string[] | null;
}

export interface CreateUserModel {
  name: string;
  email: string | null;
  homeAddress?: Address;
  shippingAddress?: Address;
  profilePic?: Photo;
}
