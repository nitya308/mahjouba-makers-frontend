import React from 'react';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import BaseView from 'components/BaseView';
import AppButton from 'components/AppButton';
import NavType from 'utils/NavType';
import { AuthStackRoutes } from 'navigation/routeTypes';
import Colors from 'utils/Colors';

const BasePage = () => {
  const navigation = useNavigation<NavType>();

  const speak = () => {
    const thingToSay = 'مرحبا، هذا اختبار';
    Speech.speak(thingToSay, { language: 'ar' });
  };

  const speak2 = () => {
    const thingToSay = 'Hello, this is a test';
    Speech.speak(thingToSay, { language: 'en' });
  };

  return (
    <BaseView logoText={'App Title'}>
      <View style={{ width: '90%' }}>
        <AppButton
          onPress={speak}
          title={'Speak (Arabic)'}
          fullWidth
          backgroundColor={Colors.primary}
          textColor='white'
        />
        <AppButton
          onPress={speak2}
          title={'Speak (English)'}
          fullWidth
          backgroundColor={Colors.primary}
          textColor='white'
        />
        <AppButton
          onPress={() => navigation.navigate(AuthStackRoutes.SIGNIN)}
          title={'Log In'}
          fullWidth
          backgroundColor={Colors.primary}
          textColor='white'
        />
        <AppButton
          onPress={() => navigation.navigate(AuthStackRoutes.SIGNUP)}
          title={'Sign Up'}
          fullWidth
        />
      </View>
    </BaseView>
  );
};

export default BasePage;