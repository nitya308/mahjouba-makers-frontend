import React, { useState } from 'react';
import { Box, HStack, Icon, Text, View, IconButton, Spacer, VStack } from 'native-base';
import MaterialSelector from 'components/MaterialSelector';
import { Alert, SafeAreaView, ScrollView } from 'react-native';
import SharpButton from 'components/SharpButton';
import DotProgress from 'components/DotProgress';
import { AntDesign } from '@expo/vector-icons';
import Colors from 'utils/Colors';
import { useTranslation } from 'react-i18next';
import TextHighlighter from 'components/SpeechHighlighter';
import AudioIcon from '../../assets/audio_icon.svg';
import styles from 'styles/onboarding';
import AppStyles from 'styles/commonstyles';

export default function MaterialSetup({ navigation, route }: { navigation: any, route: any }): JSX.Element {
  const { name, selectedImage, idNo, idPicBack, idPicFront, iceNo, icePicBack, icePicFront } = route.params;
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const { t } = useTranslation();
  const [pressed, setPressed] = useState(false);

  return (
    <SafeAreaView>
      <ScrollView style={AppStyles.mainContainer}>
        <VStack space={4} alignItems='center' mt='10' mb='100'>
          <TextHighlighter style={styles.heading} text={t('What materials do \n you work with?')} pressed={pressed} setPressed={setPressed} />
          <Box alignItems='flex-start'>
            <MaterialSelector
              selectedMaterialIds={selectedMaterialIds}
              setSelectedMaterialIds={setSelectedMaterialIds}
            />
          </Box>
        </VStack>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 50, backgroundColor: Colors.white }}>
        <HStack space={4} justifyContent='space-around' alignItems='center'>
          <SharpButton
            backgroundColor={Colors.highlight}
            leftIcon={<Icon as={AntDesign} name='arrowleft' color='white' size='lg' />}
            ml='30px'
            p='10px'
            onPress={navigation.goBack}
          />
          <DotProgress progress={5} completion={7} />
          <SharpButton
            leftIcon={<Icon as={AntDesign} name='arrowright' color='white' size='lg' />}
            p='10px'
            mr='30px'
            onPress={() => (selectedMaterialIds ? navigation.navigate('AddressSetup',
              { name, selectedProfileImage: selectedImage, idNo, idPicBack, idPicFront, iceNo, icePicBack, icePicFront, selectedMaterialIds }) : Alert.alert('Please complete all fields'))}
          />
        </HStack>
      </View>
      <IconButton
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
        style={AppStyles.audioButtonStyle}
      />
    </SafeAreaView>
  );
}
