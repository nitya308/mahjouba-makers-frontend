// import { NavigatorScreenParams } from '@react-navigation/native';
// Use NavigatorScreenParams to nest navigators within navigators

export enum BaseTabRoutes {
  JOBS = 'home',
  PROFILE = 'profile',
  CURRJOB = 'my job',
  BULLETIN = 'workshops',
  PAYMENT = 'payment',
}

export type BaseNavigationList = {
  [BaseTabRoutes.JOBS]: Record<string, unknown>;
  [BaseTabRoutes.PROFILE]: Record<string, unknown>;
  [BaseTabRoutes.CURRJOB]: Record<string, unknown>;
  [BaseTabRoutes.BULLETIN]: Record<string, unknown>;
  [BaseTabRoutes.PAYMENT]: Record<string, unknown>;
};
