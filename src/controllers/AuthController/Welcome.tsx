import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView, IconButton } from 'native-base';
import SharpButton from 'components/SharpButton';
import i18next from 'i18next';
import { Languages } from 'types/user';
import { SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';
import AudioIcon from '../../assets/audio_icon.svg';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Highlighter } from 'react-highlighter';

export default function Welcome({ navigation }) {

  const textToHighlight = 'Welcome to the app. This is a test of the audio feature.';

  const handleLanguageSelection = (language: Languages) => {
    i18next.changeLanguage(language);
    navigation.navigate('Authenticate');
  };

  const searchWords = ['quick', 'brown', 'lazy'];

  return (
    <SafeAreaView>
      <ScrollView>
        <VStack space={2}>
          <SharpButton w='100%' my='10px'
            size='sm' onPress={() => handleLanguageSelection(Languages.EN)}>
            <Text color='black' fontWeight='medium'>Welcome</Text>
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={searchWords}
              autoEscape={true}
              textToHighlight={textToHighlight}
            />
            <IconButton
              icon={<AudioIcon />}
              onPress={() => {
                Speech.speak((text), { language: i18next.language });
              }}
            />
          </SharpButton>
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
