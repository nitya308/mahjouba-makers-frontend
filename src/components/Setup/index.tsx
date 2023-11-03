import React, { useCallback, useEffect, useState } from 'react';
import { View, Button, Heading, Input, Center, Text, Box, ScrollView } from 'native-base';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector, setUserInitialized } from 'redux/slices/authSlice';
import { initUser, userDataSelector } from 'redux/slices/userDataSlice';
import { UserScopes } from 'types/user';
import AddressInput from 'components/AddressInput';
import { Image } from 'react-native-image-crop-picker';
import ProfileImageSelector from 'components/ProfileImageSelector';
import Address from 'types/address';
import { uploadMedia } from 'utils/mediaUtils';

export default function UserSetup() {
  const [name, setName] = useState<string | undefined>();
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);

  const [selectedProfile, setSelectedProfile] = useState<Image | undefined>();
  const [selectedHomeAddr, setSelectedHomeAddr] = useState<Address | undefined>();
  const [selectedShippingAddr, setSelectedShippingAddr] = useState<Address | undefined>();

  const handleSubmit = useCallback(async () => {
    // console.log(selectedHomeAddr);
    // console.log(selectedShippingAddr);
    if (!fbUserRef || !name || !selectedHomeAddr || !selectedShippingAddr) return;
    const uploadRes = await uploadMedia(`${fbUserRef?.uid}-profile`, `file://${selectedProfile?.path}`);
    dispatch(initUser({
      userData: {
        name,
        email: fbUserRef.email,
        homeAddress: selectedHomeAddr,
        shippingAddress: selectedShippingAddr,
        profilePic: uploadRes ? {
          fullUrl: uploadRes,
          fileType: 'image/jpeg',
        } : undefined,
      },
      fbUserRef,
    }));
  }, [name, selectedHomeAddr, selectedShippingAddr, selectedProfile]);

  useEffect(() => {
    if (userData?.role === UserScopes.User) {
      dispatch(setUserInitialized());
    }
  }, [userData]);

  return (
    <View flex='1'>
      <Center h='97.5%' p='10px'>
        <Heading fontSize='lg' mr='auto' fontWeight={'bold'}>
          Setup
        </Heading>

        <ProfileImageSelector
          selectedProfile={selectedProfile}
          setSelectedProfile={setSelectedProfile}
          width={200}
          height={200}
        />

        <Input 
          w='100%' 
          borderRadius='40px'  
          paddingY='8px' 
          paddingX='16px'
          placeholder='Name' 
          autoCapitalize='none'
          value={name} 
          onChangeText={setName} 
        />

        <Box w='100%' overflow='hidden'>
          <AddressInput
            placeholder='Home address'
            setAddress={setSelectedHomeAddr}/>
          <AddressInput 
            placeholder='Shipping Address'
            setAddress={setSelectedShippingAddr}/>
        </Box>

        <Button w='100%' borderRadius='40px' backgroundColor='#ddd' marginY='8px' paddingY='4px' paddingX='16px' color='#444' 
          size='sm' onPress={handleSubmit}>
          <Text color='black' fontWeight='medium'>Confirm</Text>
        </Button>
      </Center>
    </View>
  );
}
