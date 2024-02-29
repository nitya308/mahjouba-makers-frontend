import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IDSetup from './IDSetup';
import MaterialSetup from './MaterialSetup';
import ProfileSetup from './ProfileSetup';
import AddressSetup from './AddressSetup';
// import { RootStackParamList } from './src/types/nav';

const RootStack = createStackNavigator();

function App() {
  return (
    <RootStack.Navigator >
      <RootStack.Screen name="ProfileSetup" component={ProfileSetup} options={{ headerTitle: '', headerTransparent: true }}/>
      <RootStack.Screen name="IDSetup" component={IDSetup} options={{ headerTitle: '', headerTransparent: true }}/>
      <RootStack.Screen name="ICE" component={IDSetup} options={{ headerTitle: '', headerTransparent: true }}/>
      {/* <RootStack.Screen name="Banking" component={Banking} options={{ headerTitle: '', headerTransparent: true }} /> */}
      <RootStack.Screen name="Materials" component={MaterialSetup} options={{ headerTitle: '', headerTransparent: true }}/>
      <RootStack.Screen name="Address" component={AddressSetup} options={{ headerTitle: '', headerTransparent: true }}/>
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