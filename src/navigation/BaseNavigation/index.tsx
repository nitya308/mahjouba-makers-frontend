import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  BulletinController,
  CurrentJobController,
  JobsController,
  PaymentController,
  ProfileController,
} from 'controllers';
import { Icon, Text, View } from 'native-base';
import React from 'react';
import Colors from 'utils/Colors';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { fonts } from 'utils/constants';
import HammerIcon from '../../assets/hammer.svg';
import HammerIconFilled from '../../assets/hammer_filled.svg';
import PersonIcon from '../../assets/person_icon.svg';
import PersonIconFilled from '../../assets/person_icon_filled.svg';
import SearchIcon from '../../assets/search_icon.svg';
import SearchIconFilled from '../../assets/search_icon_filled.svg';
import { BaseNavigationList, BaseTabRoutes } from '../routeTypes';

const BaseTab = createBottomTabNavigator<BaseNavigationList>();
const BaseStack = createStackNavigator<BaseNavigationList>();

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'white',
    card: 'white',
    text: 'black',
  },
};

const BaseNavigation = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <BaseTab.Navigator
        screenOptions={{
          header: () => null,
          tabBarStyle: {
            backgroundColor: Colors.white,
            width: '100%',
            alignSelf: 'center',
            borderTopColor: Colors.lightGray,
            position: 'absolute',
            height: 120,
            shadowColor: Colors.black,
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: -2 },
          },
          tabBarIconStyle: {
            marginTop: 10,
          },
          tabBarLabelStyle: {
            color: Colors.black,
          },
          tabBarActiveTintColor: '#FFC01D',
        }}
        initialRouteName={BaseTabRoutes.JOBS}
      >
        <BaseTab.Screen
          name={BaseTabRoutes.JOBS}
          component={JobsController}
          options={{
            tabBarIcon: (props) => ((props.focused) ? <SearchIconFilled /> : <SearchIcon />),
            tabBarLabel: (props) => (
              <Text color={props.focused ? Colors.black : Colors.midGray}>
                {BaseTabRoutes.JOBS}
              </Text>
            ),
          }}
        />
        <BaseTab.Screen
          name={BaseTabRoutes.BULLETIN}
          component={BulletinController}
          options={{
            tabBarIcon: (props) => ((props.focused) ? <SearchIconFilled /> : <SearchIcon />),
            tabBarLabel: (props) => (
              <Text color={props.focused ? Colors.black : Colors.midGray}>
                {BaseTabRoutes.BULLETIN}
              </Text>
            ),
          }}
        />
        <BaseTab.Screen
          name={BaseTabRoutes.PAYMENT}
          component={PaymentController}
          options={{
            tabBarIcon: (props) => ((props.focused) ? <HammerIconFilled /> : <HammerIcon />),
            tabBarLabel: (props) => (
              <Text color={props.focused ? Colors.black : Colors.midGray}>
                {BaseTabRoutes.PAYMENT}
              </Text>
            ),
          }}
        />
        <BaseTab.Screen
          name={BaseTabRoutes.PROFILE}
          component={ProfileController}
          options={{
            tabBarIcon: (props) => ((props.focused) ? <PersonIconFilled /> : <PersonIcon />),
            tabBarLabel: (props) => (
              <Text color={props.focused ? Colors.black : Colors.midGray}>
                {BaseTabRoutes.PROFILE}
              </Text>
            ),
          }}
        />
      </BaseTab.Navigator>
    </NavigationContainer>
  );
};

export default BaseNavigation;
