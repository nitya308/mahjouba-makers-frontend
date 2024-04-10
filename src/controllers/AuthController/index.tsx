import React from 'react';
import Signup from './Signup';
import Login from './Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './Welcome';
import Authenticate from './Authenticate';
// import { RootStackParamList } from './src/types/nav';

const RootStack = createStackNavigator();

function App() {
  return (
    <RootStack.Navigator  screenOptions={{
      headerTitle: '',
      headerTransparent: true,
      cardStyle: { backgroundColor: 'white' }, 
    }}
    >
      <RootStack.Screen name="Welcome" component={Welcome} />
      <RootStack.Screen name="Authenticate" component={Authenticate} />
      <RootStack.Screen name="Signup" component={Signup}/>
      <RootStack.Screen name="Login" component={Login}/>
    </RootStack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
};