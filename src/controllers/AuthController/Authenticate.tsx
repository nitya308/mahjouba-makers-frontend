import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box } from 'native-base';
import SharpButton from 'components/SharpButton';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Authenticate({ navigation }) {
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <ScrollView>
        <VStack space={2} paddingTop={300}>
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => { navigation.navigate('Login'); }}>
            <Text color='black' fontWeight='medium'>{t('git In')}</Text>
          </SharpButton>
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => { navigation.navigate('Signup'); }}>
            <Text color='black' fontWeight='medium'>{t('Sign Up')}</Text>
          </SharpButton>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
