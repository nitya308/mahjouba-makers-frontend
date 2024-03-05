import React, { useState } from 'react';
import { View, Box, HStack, Heading, Icon, Text } from 'native-base';
import SharpButton from 'components/SharpButton';
import DotProgress from 'components/DotProgress';
import { AntDesign } from '@expo/vector-icons';
import Colors from 'utils/Colors';
import { useTranslation } from 'react-i18next';

export default function BankingSetup({ navigation, route }): JSX.Element {
  const { name, selectedImage, idNo, idPicBack, idPicFront, iceNo, icePicBack, icePicFront } = route.params;
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Box w='100%' minH='60px' alignItems='center'>
        <Heading fontSize='30' color='white' mt='150px' textAlign='center'>
          {t('Enter your Banking \n Information')}
        </Heading>
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
