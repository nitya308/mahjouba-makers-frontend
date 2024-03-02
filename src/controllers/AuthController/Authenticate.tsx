import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box } from 'native-base';
import SharpButton from 'components/SharpButton';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import MahjoubaLogo from '../../assets/mahjouba_logo.svg';


export default function Authenticate({ navigation }) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Center flex={1}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <VStack space={2} alignItems="center">
            <MahjoubaLogo width='141px' height='104.88px' />
            <Box height='65px' width='100%' />
            <SharpButton width='188px' height='42px' my='10px'
              size='sm' onPress={() => navigation.navigate('Login')}>
              <Text color='white' fontWeight='medium'>{t('Sign In')}</Text>
            </SharpButton>
            <SharpButton width='188px' height='42px' my='10px'
              size='sm' onPress={() => navigation.navigate('Signup')}>
              <Text color='white' fontWeight='medium'>{t('Sign Up')}</Text>
            </SharpButton>
          </VStack>
        </ScrollView>
      </Center>
    </SafeAreaView>
  );
}