import React from 'react';
import { View, Text, Center } from 'native-base';
import { FrontPage } from 'screens';
import CurrentJobPage from 'screens/BaseScreens/CurrentJobPage';

export default function CurrentJobController(): JSX.Element {
  // whatever hooks need to be run should be here
  return <View flex={1}>
    <CurrentJobPage />
  </View>;
}
