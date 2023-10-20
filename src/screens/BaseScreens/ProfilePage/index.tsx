import useAppSelector from 'hooks/useAppSelector';
import React from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { Box, Text, Center, Heading } from 'native-base';

export default function ProfilePage() {
  const { userData } = useAppSelector(userDataSelector);
  return <Center h='100%'>
    <Heading mr='auto'>Profile </Heading>
    <Text>
      { JSON.stringify(userData) }
    </Text>
  </Center>;
}