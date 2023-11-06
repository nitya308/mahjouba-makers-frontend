import React, { useState } from 'react';
import { Box, Text, Input, VStack, Center, Button } from 'native-base';
import { userPassLogin } from 'utils/auth';
import SharpButton from 'components/SharpButton';

export default function Login() {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = () => {
    if (!email || !password) {
      setError('Complete required fields');
      return;
    }
    userPassLogin(email, password)
      .catch((err) => setError(err.message));
  };

  return <VStack space={2}>
    <Input 
      w='100%' 
      borderRadius='2px'  
      paddingY='10px' 
      paddingX='16px'
      placeholder='Email' 
      autoCapitalize='none'
      borderColor='black'
      borderWidth='1px'
      size='sm'
      value={email} 
      onChangeText={setEmail} 
    />
    <Input 
      w='100%' 
      borderRadius='2px'  
      autoCapitalize='none' 
      paddingY='10px' 
      paddingX='16px' 
      placeholder='Password' 
      borderColor='black'
      borderWidth='1px'
      type='password' 
      size='sm'
      value={password} 
      onChangeText={setPassword} 
    />
    {
      error &&
        <Center>
          <Text color='red.500' textAlign='center' fontSize='xs'>{error}</Text>
        </Center>
    }
    <SharpButton w='100%' marginY='10px' color='#444' 
      size='sm' onPress={handleSubmit}>
      <Text color='black' fontWeight='medium'>Submit</Text>
    </SharpButton>
  </VStack>;
}
