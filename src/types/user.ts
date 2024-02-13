import Address from './address';
import Photo from './photo';

export enum UserScopes {
  Unverified = 'UNVERIFIED',
  Uninitialized = 'UNINITIALIZED',
  User = 'USER',
  Admin = 'ADMIN',
}

export enum Languages {
  EN = 'en',
  FR = 'fr',
  AR = 'ar',
}

export interface IUser {
  _id: string;
  authId: string;
  email: string;
  name: string;
  language?: Languages;
  role: UserScopes;
  homeAddressId: string | null;
  shippingAddressId: string | null;
  profilePicId: string | null;
  materialIds: string[] | null,
  idNo: string | null,
  iceNo: string | null,
  idPhotoFrontId: string | null,
  idPhotoBackId: string | null,
  icePhotoFrontId: string | null,
  icePhotoBackId: string | null,
  iceStatus: string | null,
  fcmTokens: string[] | null;
}

export interface CreateUserModel {
  name: string;
  email: string | null;
  language?: Languages;
  homeAddress?: Address;
  shippingAddress?: Address;
  profilePic?: Photo;
  idFront?: Photo;
  idBack?: Photo;
  iceFront?: Photo;
  iceBack?: Photo;
  idNo?: string;
  iceNo?: string;
}
