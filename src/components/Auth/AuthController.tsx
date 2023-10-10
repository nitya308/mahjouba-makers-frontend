import React, { useState } from 'react';
import { View, Box, Heading, Center, Text, Button } from 'native-base';
import Signup from './Signup';
import Login from './Login';
import { googleSignIn } from 'utils/auth';

export default function AuthController() {
  const [newUser, setNewUser] = useState(false);

  return <View flex='1'>
    <Center h='100%' w='100%'> 
      <Box 
        w='80%'
        py='40px'
        px='20px'
        bgColor='#f5f5f5' 
        shadow='9' 
        style={{ shadowOpacity: 0.12 }}
        borderRadius={20}>
        <Heading fontSize='lg' mb='20px'>
          { newUser ? 'Sign up' : 'Log in' }
        </Heading>
        {
          newUser ?
            <Signup /> :
            <Login />
        }
        <Button 
          w='100%' 
          borderRadius='40px' 
          backgroundColor='#222' 
          marginY='8px' 
          paddingY='4px' 
          paddingX='16px' 
          color='#444' 
          size='sm' 
          onPress={() => googleSignIn()}>
          <Text color='white' fontWeight='medium'>Sign in with google</Text>
        </Button>
        {
          newUser ?
            <Text color='gray.500' fontSize='xs' mt='10px'>
              Already have an account? <Text color='blue.500' fontSize='xs' onPress={() => setNewUser(false)}>Log in</Text>
            </Text> :
            <Text color='gray.500' fontSize='xs' mt='10px'>
              Don't have an account? <Text color='blue.500' fontSize='xs' onPress={() => setNewUser(true)}>Sign up</Text>
            </Text>
        }
      </Box>
    </Center>
  </View>;
}