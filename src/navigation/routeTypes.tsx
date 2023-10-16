// import { NavigatorScreenParams } from '@react-navigation/native';
// Use NavigatorScreenParams to nest navigators within navigators

export enum BaseTabRoutes {
  JOBS = 'Browse Jobs',
  PROFILE = 'Your Profile',
  CURRJOB = 'Current Job',
}

export type BaseNavigationList = {
  [BaseTabRoutes.JOBS]: Record<string, unknown>;
  [BaseTabRoutes.PROFILE]: Record<string, unknown>;
  [BaseTabRoutes.CURRJOB]: Record<string, unknown>;
};