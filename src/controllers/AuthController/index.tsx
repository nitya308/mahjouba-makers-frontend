import React, { useState } from 'react';
import { View, Box, Heading, Center, Text, Button } from 'native-base';
import Signup from './Signup';
import Login from './Login';
import { googleSignIn } from 'utils/auth';
import ArchScroll from 'components/ArchScroll';
import SharpButton from 'components/SharpButton';

export default function AuthController() {
  const [newUser, setNewUser] = useState(false);

  return <View flex='1'>
    <ArchScroll>
      <Center h='100%' w='100%'> 
        <Box 
          w='80%'
          py='40px'
          px='20px'
          borderRadius={20}>
          <Heading fontSize='xl' mb='20px' mx='auto'>
            { newUser ? 'Sign up' : 'Log in' }
          </Heading>
          {
            newUser ?
              <Signup /> :
              <Login />
          }
          <SharpButton 
            w='100%' 
            backgroundColor='#eee' 
            my='8px'
            size='sm' 
            onPress={() => googleSignIn()}>
            <Text color='black' fontWeight='medium'>Sign in with google</Text>
          </SharpButton>
          {
            newUser ?
              <Text color='gray.500' fontSize='xs' mt='10px' mx='auto'>
                Already have an account? <Text color='blue.500' fontSize='xs' onPress={() => setNewUser(false)}>Log in</Text>
              </Text> :
              <Text color='gray.500' fontSize='xs' mt='10px' mx='auto'>
                Don't have an account? <Text color='blue.500' fontSize='xs' onPress={() => setNewUser(true)}>Sign up</Text>
              </Text>
          }
        </Box>
      </Center>
    </ArchScroll>
  </View>;
}