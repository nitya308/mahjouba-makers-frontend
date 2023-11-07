import React, { useEffect, useState } from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import useAppSelector from 'hooks/useAppSelector';
import { Box, HStack, Spacer, IconButton, Icon, Button, Center, Text, Heading, ScrollView } from 'native-base';
import { Image as ExpoImage } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import { authSelector } from 'redux/slices/authSlice';
import addressApi from 'requests/addressApi';

export default function ProfileDisplay({
  toggleEditing,
  toggleSettingsOpen,
}: {
  toggleEditing: () => void;
  toggleSettingsOpen: () => void;
}): JSX.Element {
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData, profileImageUri } = useAppSelector(userDataSelector);
  const [addressString, setAddressString] = useState<string | undefined>();

  useEffect(() => {
    if (addressString) return;
    const pullAddress = async () => {
      if (!fbUserRef || !userData?.shippingAddressId) return;
      const address = await addressApi.getAddress(userData.shippingAddressId, fbUserRef);
      setAddressString(address.description);
    };
    pullAddress();
  }, [userData, fbUserRef, addressString]);

  return (
    <Box pt='100px'>
      <HStack>
        <Spacer />
        <IconButton 
          icon={<Icon as={AntDesign} name='edit' />} 
          onPress={toggleEditing}
          mr='10px'
        />
        <Heading ml='auto'>My Profile</Heading>
      </HStack>
      <Button ml='auto' onPress={toggleSettingsOpen}>
        Account Settings
      </Button>
      <ScrollView flex='1'>
        <Center my='20px'>
          <ExpoImage
            source={{
              uri: profileImageUri || DEFAULT_PROFILE_URI, 
            }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 100,
            }}
          />
          <Heading fontSize='lg' fontWeight='bold' my='10px'>
            {userData?.name}
          </Heading>
          <Text maxW='300px' numberOfLines={1} fontSize='sm'>
            {addressString ? addressString : null}
          </Text>
        </Center>

        <Text>
          { JSON.stringify(userData) }
        </Text>
      </ScrollView>
    </Box>
  );
}