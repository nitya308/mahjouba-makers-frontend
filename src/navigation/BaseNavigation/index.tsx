import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { BaseTabRoutes, BaseNavigationList } from '../routeTypes';
import { Icon } from 'native-base';
import { JobsController, ProfileController, CurrentJobController } from 'controllers';

const BaseTab = createBottomTabNavigator<BaseNavigationList>();
const BaseStack = createStackNavigator<BaseNavigationList>();

// const ProtectedRoute = (allowableScopes: UserScopes[]) => {
//   const { authenticated, role } = useAppSelector((state) => state.auth);

//   return (allowableScopes.includes(role) && authenticated);
// };

// const JobsNavigator = () => {
//   return (
//     <BaseStack.Navigator initialRouteName={BaseTabRoutes.JOBS}>
//       <BaseStack.Screen
//         name={BaseTabRoutes.JOBS}
//         component={JobsController}
//         options={{ header: () => null }}
//       />
//     </BaseStack.Navigator>
//   );
// };

// const CurrentJobNavigator = () => {
//   return (
//     <BaseStack.Navigator initialRouteName={BaseTabRoutes.JOBS}>
//       <BaseStack.Screen
//         name={BaseTabRoutes.CURRJOB}
//         component={CurrentJobController}
//         options={{ header: () => null }}
//       />
//     </BaseStack.Navigator>
//   );
// };

// const ProfileNavigator = () => {
//   return (
//     <BaseStack.Navigator initialRouteName={BaseTabRoutes.JOBS}>
//       <BaseStack.Screen
//         name={BaseTabRoutes.PROFILE}
//         component={ProfileController}
//         options={{ header: () => null }}
//       />
//     </BaseStack.Navigator>
//   );
// };

const BaseNavigation = () => {
  return (
    <NavigationContainer>
      <BaseTab.Navigator
        screenOptions={{
          header: () => null,
          tabBarStyle: {
            backgroundColor: '#D3D3D3',
            bottom: 15,
            width: '90%',
            alignSelf: 'center',
            borderRadius: 30,
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
        initialRouteName={BaseTabRoutes.JOBS}
      >
        <BaseTab.Screen
          name={BaseTabRoutes.JOBS}
          component={JobsController}
          options={{ tabBarIcon: (props) => <Icon as={Entypo} name='tools' color={props.color} /> }}
        />
        <BaseTab.Screen
          name={BaseTabRoutes.CURRJOB}
          component={CurrentJobController}
          options={{ tabBarIcon: (props) => <Icon as={Entypo} name='suitcase' color={props.color} /> }}
        />
        <BaseTab.Screen
          name={BaseTabRoutes.PROFILE}
          component={ProfileController}
          options={{ tabBarIcon: (props) => <Icon as={AntDesign} name='user' color={props.color} /> }}
        />
      </BaseTab.Navigator>
    </NavigationContainer>
  );
};

export default BaseNavigation;