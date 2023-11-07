import React from 'react';
import AddressInput from 'components/AddressInput';
import Address from 'types/address';
import { Box, Text } from 'native-base';

export default function AddressSetup({
  selectedAddress,
  setSelectedAddress,
}: {
  selectedAddress?: Address;
  setSelectedAddress: (newAddress?: Address) => void;
}): JSX.Element {
  return <Box w='100%' minH='60px'>
    <Text fontSize='md' my='10px'>Location</Text>
    <Box w='100%' borderColor='green.500' borderRadius='5px' borderWidth={selectedAddress ? '2px' : '0px'}>
      <AddressInput
        setAddress={(setSelectedAddress)}
        placeholder={selectedAddress?.description || 'Address'}
      />
    </Box>
  </Box>;
}
