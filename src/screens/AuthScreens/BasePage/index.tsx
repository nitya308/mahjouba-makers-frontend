import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import BaseView from 'components/BaseView';
import AppButton from 'components/AppButton';
import NavType from 'utils/NavType';
import { AuthStackRoutes } from 'navigation/routeTypes';
import Colors from 'utils/Colors';

const BasePage = () => {
  const navigation = useNavigation<NavType>();

  return (
    <BaseView logoText={'Vibe'}>
      <View style={{ width: '90%' }}>
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