// import { NavigatorScreenParams } from '@react-navigation/native';
// Use NavigatorScreenParams to nest navigators within navigators

export enum BaseTabRoutes {
  JOBS = 'search',
  PROFILE = 'profile',
  CURRJOB = 'my job',
}

export type BaseNavigationList = {
  [BaseTabRoutes.JOBS]: Record<string, unknown>;
  [BaseTabRoutes.PROFILE]: Record<string, unknown>;
  [BaseTabRoutes.CURRJOB]: Record<string, unknown>;
};