import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView } from 'native-base';
import SharpButton from 'components/SharpButton';
import i18next from 'i18next';
import { Languages } from 'types/user';
import { SafeAreaView } from 'react-native';
import MahjoubaLogo from '../../assets/mahjouba_logo.svg';

export default function Welcome({ navigation }) {

  const handleLanguageSelection = (language: Languages) => {
    i18next.changeLanguage(language);
    navigation.navigate('Authenticate');
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Center flex={1}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <VStack space={2} alignItems="center">
            <MahjoubaLogo width='141px' height='104.88px' />
            <Box height='65px' width='100%' />
            <SharpButton width='188px' height='42px' my='10px'
              size='sm' onPress={() => handleLanguageSelection(Languages.EN)}>
              <Text color='white' fontWeight='medium'>Welcome</Text>
            </SharpButton>
            <SharpButton width='188px' height='42px' my='10px'
              size='sm' onPress={() => handleLanguageSelection(Languages.FR)}>
              <Text color='white' fontWeight='medium'>Bienvenue</Text>
            </SharpButton>
            <SharpButton width='188px' height='42px' my='10px'
              size='sm' onPress={() => handleLanguageSelection(Languages.AR)}>
              <Text color='white' fontWeight='medium'>مرحباً</Text>
            </SharpButton>
          </VStack>
        </ScrollView>
      </Center>
    </SafeAreaView>
  );
}