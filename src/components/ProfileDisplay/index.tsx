import React from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import useAppSelector from 'hooks/useAppSelector';
import { Box, HStack, Spacer, IconButton, Icon, Button, Center, Text, Heading } from 'native-base';
import { Image as ExpoImage } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';
import { DEFAULT_PROFILE_URI } from 'utils/constants';

export default function ProfileDisplay({
  toggleEditing,
  toggleSettingsOpen,
}: {
  toggleEditing: () => void;
  toggleSettingsOpen: () => void;
}): JSX.Element {
  const { userData, profileImageUri } = useAppSelector(userDataSelector);

  return (
    <Box>
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
      </Center>
      <Text>
        { JSON.stringify(userData) }
      </Text>
    </Box>
  );
}