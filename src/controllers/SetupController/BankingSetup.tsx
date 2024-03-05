import React, { useState } from 'react';
import { View, Box, HStack, Heading, Icon, Text, IconButton } from 'native-base';
import SharpButton from 'components/SharpButton';
import AudioIcon from '../../assets/audio_icon.svg';
import DotProgress from 'components/DotProgress';
import { AntDesign } from '@expo/vector-icons';
import Colors from 'utils/Colors';
import { useTranslation } from 'react-i18next';
import TextHighlighter from 'components/SpeechHighlighter';
import styles from 'styles/onboarding';

export default function BankingSetup({ navigation, route }): JSX.Element {
  const { name, selectedImage, idNo, idPicBack, idPicFront, iceNo, icePicBack, icePicFront } = route.params;
  const { t } = useTranslation();
  const [pressed, setPressed] = useState(false);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <IconButton
        style={styles.audioStyle}
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
      />
      <Box w='100%' minH='60px' mt='150px' alignItems='center'>
        <TextHighlighter style={styles.heading} text={t('Enter your Banking \n Information')} pressed={pressed} setPressed={setPressed} />
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
          <DotProgress progress={4} completion={7} />
          <SharpButton
            backgroundColor={Colors.highlight}
            leftIcon={<Icon as={AntDesign} name='arrowright' color='white' size='lg' />}
            p='10px'
            mr='30px'
            onPress={() => (navigation.navigate('MaterialSetup', { name, selectedImage, idNo, idPicBack, idPicFront, iceNo, icePicBack, icePicFront }))}
          />
        </HStack>
      </View>
    </View>
  );
}
