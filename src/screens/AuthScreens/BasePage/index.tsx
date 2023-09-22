import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import BaseView from 'components/BaseView';
import AppButton from 'components/AppButton';
import NavType from 'utils/NavType';
import { AuthStackRoutes } from 'navigation/routeTypes';
import Colors from 'utils/Colors';
import { useTranslation } from 'react-i18next';
import SelectLanguage from 'components/SelectLanguage';
import { Text } from 'native-base';
import { fonts } from 'utils/constants';

const BasePage = () => {
  const navigation = useNavigation<NavType>();
  const { t } = useTranslation();

  return (
    <BaseView logoText={'App Title'}>
      <View style={{ width: '90%' }}>
        <AppButton
          onPress={() => navigation.navigate(AuthStackRoutes.SIGNIN)}
          title={t('Log In')}
          fullWidth
          backgroundColor={Colors.primary}
          textColor='white'
        />
        <AppButton
          onPress={() => navigation.navigate(AuthStackRoutes.SIGNUP)}
          title={t('Sign Up')}
          fullWidth
        />
        <Text
          color="white" fontSize={24} fontFamily={fonts.medium}
        >
          {
            t('Hello world')
          }
        </Text>
        <SelectLanguage />
      </View>
    </BaseView>
  );
};

export default BasePage;