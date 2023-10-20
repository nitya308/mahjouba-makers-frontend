import React from 'react';
import { View, Text, Center } from 'native-base';
import ProfilePage from 'screens/BaseScreens/ProfilePage';

export default function ProfileController(): JSX.Element {
  return <View flex={1}>
    <ProfilePage />
  </View>;
}
