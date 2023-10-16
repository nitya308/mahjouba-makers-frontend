import React, { useState } from 'react';
import { Text, Input, VStack, Center, Button } from 'native-base';
import { userPassSignUp } from 'utils/auth';

export default function Signup() {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [passConfirm, setPassConfirm] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = () => {
    if (!email || !password || !passConfirm) {
      setError('Complete required fields');
      return;
    } else if (password != passConfirm) {
      setError('Passwords do not match');
    }
    userPassSignUp(email, password)
      .catch((err) => setError(err.message));
  };

  return <VStack space={2}>
    <Input 
      w='100%' 
      borderRadius='40px'  
      paddingY='8px' 
      paddingX='16px'
      placeholder='Email' 
      autoCapitalize='none'
      value={email} 
      onChangeText={setEmail} 
    />
    <Input 
      w='100%' 
      borderRadius='40px'  
      autoCapitalize='none' 
      paddingY='8px' 
      paddingX='16px' 
      placeholder='Password' 
      type='password' 
      value={password} 
      onChangeText={setPassword} 
    />
    <Input 
      w='100%' 
      borderRadius='40px'  
      autoCapitalize='none' 
      paddingY='8px' 
      paddingX='16px' 
      placeholder='Confirm password' 
      type='password' 
      value={passConfirm} 
      onChangeText={setPassConfirm} 
    />
    {
      error &&
        <Center>
          <Text color='red.500' textAlign='center' fontSize='xs'>{error}</Text>
        </Center>
    }
    <Button w='100%' borderRadius='40px' backgroundColor='#ddd' marginY='8px' paddingY='4px' paddingX='16px' color='#444' 
      size='sm' onPress={handleSubmit}>
      <Text color='black' fontWeight='medium'>Submit</Text>
    </Button>
  </VStack>;
}
