import React, { useCallback, useEffect, useState } from 'react';
import { View, Button, Heading, Input, Center, Text } from 'native-base';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector, setUserInitialized } from 'redux/slices/authSlice';
import { getUser, initUser, userDataSelector } from 'redux/slices/userDataSlice';
import { UserScopes } from 'types/users';

export default function UserSetup() {
  const [name, setName] = useState<string | undefined>();
  const dispatch = useAppDispatch();
  const { fbUserRef, authenticated } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);

  const handleSubmit = useCallback(async () => {
    if (!fbUserRef) return;
    dispatch(initUser({
      userData: {
        name,
      },
      fbUserRef,
    }));
  }, [name]);

  useEffect(() => {
    if (userData?.role === UserScopes.User) {
      dispatch(setUserInitialized());
    }
  }, [userData]);

  return (
    <View flex='1'>
      <Center h='100%' p='10px'>
        <Heading fontSize='lg'>
          Setup
        </Heading>

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
        <Button w='100%' borderRadius='40px' backgroundColor='#ddd' marginY='8px' paddingY='4px' paddingX='16px' color='#444' 
          size='sm' onPress={handleSubmit}>
          <Text color='black' fontWeight='medium'>Confirm</Text>
        </Button>
      </Center>
    </View>
  );
}
