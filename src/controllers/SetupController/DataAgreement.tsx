import React, { useState } from 'react';
import { View, Box, HStack, Heading, Icon, Text } from 'native-base';
import SharpButton from 'components/SharpButton';
import DotProgress from 'components/DotProgress';
import { AntDesign } from '@expo/vector-icons';

export default function DataAgreement({ navigation }): JSX.Element {
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Box w='100%' minH='60px' alignItems='center'>
        <Heading fontSize='30' color='white' mt='150px' textAlign='center'>
          Data Protection Agreement
        </Heading>
        <Text fontSize='20' color='white' mt='20px' textAlign='center'>
          Lorem ipsum dolor sit , proctection adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt.
        </Text>
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
            leftIcon={<Icon as={AntDesign} name='arrowright' color='white' size='lg' />}
            p='10px'
            mr='30px'
            onPress={() => (navigation.navigate('IDSetup'))}
          />
        </HStack>
      </View>
    </View>
  );
}
