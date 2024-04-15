import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IDSetup from './IDSetup';
import MaterialSetup from './MaterialSetup';
import ProfileSetup from './ProfileSetup';
import AddressSetup from './AddressSetup';
import ICESetup from './ICESetup';
import DataAgreement from './DataAgreement';
import BankingSetup from './BankingSetup';
// import { RootStackParamList } from './src/types/nav';

const RootStack = createStackNavigator();

function App() {
  return (
    <RootStack.Navigator screenOptions={{
      headerTitle: '',
      headerTransparent: true,
      cardStyle: { backgroundColor: 'white' },
      headerLeft: () => null,
    }}>
      <RootStack.Screen name="ProfileSetup" component={ProfileSetup} />
      {/* <RootStack.Screen name="DataAgreement" component={DataAgreement} />
      <RootStack.Screen name="IDSetup" component={IDSetup} />
      <RootStack.Screen name="ICESetup" component={ICESetup} />
      <RootStack.Screen name="BankingSetup" component={BankingSetup} /> */}
      <RootStack.Screen name="MaterialSetup" component={MaterialSetup} />
      <RootStack.Screen name="AddressSetup" component={AddressSetup} />
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