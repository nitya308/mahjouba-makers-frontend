import React, { useState } from 'react';
import AddressInput from 'components/AddressInput';
import Address from 'types/address';
import { View, Box, HStack, Heading, Icon, Text } from 'native-base';
import Colors from 'utils/Colors';
import SharpButton from 'components/SharpButton';
import DotProgress from 'components/DotProgress';
import { AntDesign } from '@expo/vector-icons';
import { Alert } from 'react-native';

export default function AddressSetup({ navigation }): JSX.Element {
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  return (
    <View style={{ flex: 1 }} alignItems='center'>
      <Box w='100%' alignItems='center' justifyContent='center' mt={150}>
        <Heading fontSize='30' color='white' textAlign='center'>
          Where do you {'\n'} work?
        </Heading>
        <Box w={200} mt={70} borderColor={Colors.outline} borderRadius='5px' borderWidth={selectedAddress ? '2px' : '0px'}>
          <AddressInput
            setAddress={setSelectedAddress}
            placeholder={selectedAddress?.description || 'Address'}
          />
        </Box>
      </Box>
      <SharpButton
        mt='20px'
        w='200px'
        onPress={() => (selectedAddress ? navigation.navigate('AddressSetup') : Alert.alert('Please complete all fields'))}
      >
        <Text fontSize='20' color='white' textAlign='center'>
          Create Account
        </Text>
      </SharpButton>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, marginBottom: 50 }}>
        <HStack
          space={4}
          justifyContent='space-around'
          alignItems='center'
          alignSelf='flex-end'
          width='100%'
        >
          <SharpButton
            leftIcon={<Icon as={AntDesign} name='arrowleft' color='white' size='lg' />}
            ml='30px'
            p='10px'
            onPress={navigation.goBack}
          />
          <DotProgress progress={6} completion={7} />
        </HStack>
      </View>
    </View>
  );
}
