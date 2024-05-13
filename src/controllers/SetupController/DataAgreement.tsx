import React, { useState } from 'react';
import { View, Box, HStack, Heading, Icon, Text, Spacer, IconButton } from 'native-base';
import SharpButton from 'components/SharpButton';
import DotProgress from 'components/DotProgress';
import { AntDesign } from '@expo/vector-icons';
import Colors from 'utils/Colors';
import { useTranslation } from 'react-i18next';
import TextHighlighter from 'components/SpeechHighlighter';
import styles from 'styles/onboarding';
import AudioIcon from '../../assets/audio_icon.svg';
import StopIcon from '../../assets/hand_icon.svg';
import * as Speech from 'expo-speech';

export default function DataAgreement({ navigation, route }): JSX.Element {
  const [pressed, setPressed] = useState(false);
  const { name, selectedImage } = route.params;
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <IconButton
        style={styles.audioStyle}
        icon={!pressed ? <AudioIcon /> : <StopIcon/>}
        onPress={() => {
          if (pressed) {
            Speech.stop();
            setPressed(false);
          } else {
            setPressed(true);
          }
        }}
      />
      <Box w='100%' minH='60px' mt='150px' alignItems='center'>
        
        <TextHighlighter style={styles.heading} text={t('Data Protection')} pressed={pressed} setPressed={setPressed} />
        <TextHighlighter style={styles.heading} text={t('Agreement')} pressed={pressed} setPressed={setPressed} />
        <Spacer size='20' />
        <TextHighlighter
          style={styles.body}
          text={t(
            'Lorem ipsum dolor sit, consectetur adipiscing elit, ' +
            'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
            'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit ' +
            'in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
            'Excepteur sint occaecat cupidatat non proident, sunt.')
          }
          pressed={pressed}
          setPressed={setPressed}
        />
      </Box>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, marginBottom: 50 }}>
        <HStack
          space={4}
          justifyContent='space-around'
          alignItems='center'
          width='100%'
        >
          <SharpButton
            leftIcon={<Icon as={AntDesign} name='arrowleft' color='white' size='lg' />}
            ml='30px'
            p='10px'
            onPress={navigation.goBack}
          />
          <DotProgress progress={1} completion={7} />
          <SharpButton
            backgroundColor={Colors.highlight}
            leftIcon={<Icon as={AntDesign} name='arrowright' color='white' size='lg' />}
            p='10px'
            mr='30px'
            onPress={() => (navigation.navigate('IDSetup', { name, selectedImage }))}
          />
        </HStack>
      </View>
    </View>
  );
}
