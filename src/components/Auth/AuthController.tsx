import React, { useState } from 'react';
import { View, Box, Heading, Center, Text } from 'native-base';
import Signup from './Signup';
import Login from './Login';

export default function AuthController() {
  const [newUser, setNewUser] = useState(false);

  return <View>
    <Center> 
      <Box 
        py='40px'
        px='10px'
        bgColor='#f5f5f5' 
        shadow='9' 
        style={{ shadowOpacity: 0.12 }}
        borderRadius={20}>
        <Heading fontSize='lg'>
          { newUser ? 'Sign up' : 'Log in' }
        </Heading>
        {
          newUser ?
            <Signup /> :
            <Login />
        }
        {
          newUser ?
            <Text color='gray.500' fontSize='xs'>
              Already have an account? <Text color='blue.500' fontSize='xs' onPress={() => setNewUser(false)}>Log in</Text>
            </Text> :
            <Text color='gray.500' fontSize='xs'>
              Don't have an account? <Text color='blue.500' fontSize='xs' onPress={() => setNewUser(false)}>Sign up</Text>
            </Text>
        }
      </Box>
    </Center>
  </View>;
}