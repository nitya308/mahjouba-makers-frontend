import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'; 
import { BasePage, SignInPage, SignUpPage } from 'screens/AuthScreens';
import { AuthStackRoutes, AuthNavigationList } from '../routeTypes';

const AuthStack = createStackNavigator<AuthNavigationList>();

const AuthNavigation = () => {
  return (
    <NavigationContainer>
      <AuthStack.Navigator
        screenOptions={{ header: () => null }}
      >
        <AuthStack.Screen name={AuthStackRoutes.BASE} component={BasePage} />
        <AuthStack.Screen name={AuthStackRoutes.SIGNIN} component={SignInPage} />
        <AuthStack.Screen name={AuthStackRoutes.SIGNUP} component={SignUpPage} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigation;