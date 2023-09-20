import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign, Octicons, Ionicons } from '@expo/vector-icons';
import useAppSelector from 'hooks/useAppSelector';
import { UserScopes } from 'types/users';
import { FrontPage, ResourcesPage, UsersPage, ForbiddenPage } from 'screens/BaseScreens';
import { BaseTabRoutes, BaseNavigationList } from '../routeTypes';
import { HStack } from 'native-base';
import RingsIcon from 'assets/ringicon.svg';
import ProfileNavBaseIcon from 'assets/profile-nav-base.svg';
import Colors from 'utils/Colors';

const BaseTab = createBottomTabNavigator<BaseNavigationList>();
const BaseStack = createStackNavigator<BaseNavigationList>();

const ProtectedRoute = (allowableScopes: UserScopes[]) => {
  const { authenticated, role } = useAppSelector((state) => state.auth);

  return (allowableScopes.includes(role) && authenticated);
};

const FrontNavigator = () => {
  return (
    <BaseStack.Navigator initialRouteName={BaseTabRoutes.FRONT}>
      <BaseStack.Screen
        name={BaseTabRoutes.FRONT}
        component={FrontPage}
        options={{ header: () => null }}
      />
    </BaseStack.Navigator>
  );
};

const UsersNavigator = () => {
  return (
    <BaseStack.Navigator initialRouteName={BaseTabRoutes.USERS}>
      <BaseStack.Screen
        name={BaseTabRoutes.USERS}
        component={UsersPage}
        options={{ header: () => null }}
      />
    </BaseStack.Navigator>
  );
};

const ResourcesNavigator = () => {
  return (
    <BaseStack.Navigator initialRouteName={BaseTabRoutes.RESOURCES}>
      <BaseStack.Screen
        name={BaseTabRoutes.RESOURCES}
        component={ResourcesPage}
        options={{ header: () => null }}
      />
    </BaseStack.Navigator>
  );
};

const BaseNavigation = () => {
  return (
    <NavigationContainer>
      <BaseTab.Navigator
        screenOptions={{
          header: () => null,
          tabBarStyle: {
            backgroundColor: 'rgba(147,111,209,0.25)',
            bottom: 15,
            width: '90%',
            alignSelf: 'center',
            borderRadius: 15,
            borderTopWidth: 0,
            position: 'absolute',
            left: '5%',
            height: 60,
          },
          tabBarShowLabel: false,
          tabBarIconStyle: {
            marginTop: 50,
          },
        }}
        initialRouteName={BaseTabRoutes.FRONT}
      >
        <BaseTab.Screen
          name={BaseTabRoutes.USERS}
          component={
            ProtectedRoute([UserScopes.Admin])
              ? UsersNavigator
              : ForbiddenPage
          }
          options={{ tabBarIcon: () => (
            <HStack width={35} height={35} alignItems="center" justifyContent="center">
              <ProfileNavBaseIcon style={{ position: 'absolute' }} />
            </HStack>
          ) }}
        />
        <BaseTab.Screen
          name={BaseTabRoutes.FRONT}
          component={FrontNavigator}
          options={{ tabBarIcon: () => <RingsIcon /> }}
        />
        <BaseTab.Screen
          name={BaseTabRoutes.RESOURCES}
          component={
            ProtectedRoute([UserScopes.User, UserScopes.Admin])
              ? ResourcesNavigator
              : ForbiddenPage
          }
          options={{ tabBarIcon: () => (
            <HStack width={35} height={35} alignItems="center" justifyContent="center">
              <ProfileNavBaseIcon style={{ position: 'absolute' }} />
            </HStack>
          ) }}
        />
      </BaseTab.Navigator>
    </NavigationContainer>
  );
};

export default BaseNavigation;