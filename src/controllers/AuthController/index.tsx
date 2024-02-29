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
    <RootStack.Navigator >
      <RootStack.Screen name="Welcome" component={Welcome}  options={{ headerTitle: '', headerTransparent: true }}/>
      <RootStack.Screen name="Authenticate" component={Authenticate} options={{ headerTitle: '', headerTransparent: true }} />
      <RootStack.Screen name="Signup" component={Signup} options={{ headerTitle: '', headerTransparent: true }}/>
      <RootStack.Screen name="Login" component={Login} options={{ headerTitle: '', headerTransparent: true }}/>
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