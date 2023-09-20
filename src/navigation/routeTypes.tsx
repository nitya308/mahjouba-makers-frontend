// import { NavigatorScreenParams } from '@react-navigation/native';
// Use NavigatorScreenParams to nest navigators within navigators

export enum AuthStackRoutes {
  BASE = 'Base',
  SIGNIN = 'Sign In',
  SIGNUP = 'Sign Up',
}

export type AuthNavigationList = {
  [AuthStackRoutes.BASE]: Record<string, unknown>;
  [AuthStackRoutes.SIGNIN]: Record<string, unknown>;
  [AuthStackRoutes.SIGNUP]: Record<string, unknown>;
};

export enum BaseTabRoutes {
  FRONT = 'Front Page',
  USERS = 'Users',
  RESOURCES = 'Resources',
}

export type BaseNavigationList = {
  [BaseTabRoutes.FRONT]: Record<string, unknown>;
  [BaseTabRoutes.USERS]: Record<string, unknown>;
  [BaseTabRoutes.RESOURCES]: Record<string, unknown>;
};