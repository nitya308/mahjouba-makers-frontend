import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { BaseTabRoutes, BaseNavigationList } from '../routeTypes';
import { Icon, View, Text } from 'native-base';
import { JobsController, ProfileController, CurrentJobController } from 'controllers';
import { fonts } from 'utils/constants';
import SearchIcon from '../../assets/search_icon.svg';
import SearchIconFilled from '../../assets/search_icon_filled.svg';
import PersonIcon from '../../assets/person_icon.svg';
import PersonIconFilled from '../../assets/person_icon_filled.svg';
import HammerIcon from '../../assets/hammer.svg';
import HammerIconFilled from '../../assets/hammer_filled.svg';
import Colors from 'utils/Colors';

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
            backgroundColor: Colors.backgroundWhite,
            width: '100%',
            alignSelf: 'center',
            borderTopWidth: 2,
            borderTopColor: 'black',
            position: 'absolute',
            height: 120,
          },
          tabBarIconStyle: {
            marginTop: 10,
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
              <Text fontFamily={props.focused ? fonts.bold : fonts.regular}>
                {BaseTabRoutes.JOBS}
              </Text>
            ),
          }}
        />
        <BaseTab.Screen
          name={BaseTabRoutes.CURRJOB}
          component={CurrentJobController}
          options={{ 
            tabBarIcon: (props) => ((props.focused) ? <HammerIconFilled /> : <HammerIcon />),
            tabBarLabel: (props) => (
              <Text fontFamily={props.focused ? fonts.bold : fonts.regular}>
                {BaseTabRoutes.CURRJOB}
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
              <Text fontFamily={props.focused ? fonts.bold : fonts.regular}>
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