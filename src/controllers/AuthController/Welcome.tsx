import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView, IconButton } from 'native-base';
import SharpButton from 'components/SharpButton';
import i18next from 'i18next';
import { Languages } from 'types/user';
import { SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';
import AudioIcon from '../../assets/audio_icon.svg';
import TextHighlighter from '../../components/SpeechHighlighter';
import { useTranslation } from 'react-i18next';

export default function Welcome({ navigation }) {

  const handleLanguageSelection = (language: Languages) => {
    i18next.changeLanguage(language);
    navigation.navigate('Authenticate');
  };

  const [press, setPressed] = useState(false);

  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <ScrollView>
        <VStack space={2}>
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => handleLanguageSelection(Languages.EN)}>
            <Text color='black' fontWeight='medium'>Welcome</Text>
          </SharpButton>
          <TextHighlighter text={t('This is a welcome to my app')} pressed={press} setPressed={setPressed}></TextHighlighter>
          <TextHighlighter text={t('here is some different stuff')} pressed={press} setPressed={setPressed}></TextHighlighter>
          <IconButton
            icon={<AudioIcon />}
            onPress={() => {
              setPressed(true);
            }}
          />
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => handleLanguageSelection(Languages.FR)}>
            <Text color='black' fontWeight='medium'>French</Text>
          </SharpButton>
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => handleLanguageSelection(Languages.AR)}>
            <Text color='black' fontWeight='medium'>Arabic</Text>
          </SharpButton>
        </VStack>
      </ScrollView>
    </SafeAreaView>

  );
}
