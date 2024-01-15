import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box } from 'native-base';
import { phonePassSignup, userPassSignUp } from 'utils/auth';
import SharpButton from 'components/SharpButton';
import IDSetup from '..//SetupController/IDSetup';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { app, auth } from '../../../firebase';
import { ConfirmationResult, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import useAppDispatch from 'hooks/useAppDispatch';
import { setName as setReduxName } from 'redux/slices/authSlice';

export default function Signup() {
  const dispatch = useAppDispatch();

  const recaptchaVerifier = useRef<any>(null);
  const [name, setName] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [confirmationCode, setConfirmationCode] = useState<string | undefined>();
  // const [password, setPassword] = useState<string | undefined>();
  // const [passConfirm, setPassConfirm] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [confirmResult, setConfirmResult] = useState<string | undefined>();

  useEffect(() => {
    // Fetch country code
    fetch('https://ipapi.co/country_calling_code/')
      .then(response => response.text())
      .then(data => {
        // Set the fetched country code as the default value for phone state
        setPhone(data.trim());
      })
      .catch(e => {
        console.error('Error fetching country code:', e);
      });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!phone || !name) {
      setError('Complete required fields');
      return;
    } 
    // else if (password != passConfirm) {
    //   setError('Passwords do not match');
    //   return;
    // }
    try {
      // console.log(recaptchaVerifier.current);
      dispatch(setReduxName(name));
      const result = await phonePassSignup(phone, recaptchaVerifier.current);
      console.log(result);
      setConfirmResult(result);
      setPhoneVerify(true);
    } catch (err) {
      setError((err as any).message);
    }
  }, [phone, name, recaptchaVerifier]);

  const handlePhoneConfirm = useCallback(async () => {
    if (!confirmationCode || !confirmResult) {
      setError('Enter verification code');
      return;
    }
    try {
      const credential = await PhoneAuthProvider.credential(confirmResult, confirmationCode);
      await signInWithCredential(auth, credential);
    } catch (err) {
      console.log(err);
      setError('Confirmation failed');
    }
  }, [confirmationCode, confirmResult]);

  return (
    <VStack space={2}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        // attemptInvisibleVerification
      />
      {
        !phoneVerify ?
          <VStack space={2} mb='10px'>
            <Text fontSize='md' mx='auto'>
              Name
            </Text>
            <Input 
              w='100%' 
              borderRadius='2px'  
              paddingY='10px' 
              paddingX='16px'
              borderColor='black'
              borderWidth='1px'
              placeholder='Name' 
              autoCapitalize='none'
              size='sm'
              type='text'
              value={name} 
              onChangeText={setName} 
            />
            <Text fontSize='md' mx='auto'>
              Phone
            </Text>
            <Input 
              w='100%' 
              borderRadius='2px'  
              paddingY='10px' 
              paddingX='16px'
              borderColor='black'
              borderWidth='1px'
              placeholder='Phone #' 
              autoCapitalize='none'
              size='sm'
              type='text'
              value={phone} 
              onChangeText={setPhone} 
            />
            {/* <Text fontSize='md' mx='auto'>
              Password
            </Text>
            <Input 
              w='100%' 
              borderRadius='2px'  
              autoCapitalize='none' 
              paddingY='10px' 
              paddingX='16px' 
              borderColor='black'
              borderWidth='1px'
              placeholder='Password' 
              size='sm'
              type='password' 
              value={password} 
              onChangeText={setPassword} 
            />
            <Text fontSize='md' mx='auto'>
              Confirm Password
            </Text>
            <Input 
              w='100%' 
              borderRadius='2px'  
              autoCapitalize='none' 
              paddingY='8px' 
              paddingX='16px' 
              borderColor='black'
              borderWidth='1px'
              placeholder='Confirm password' 
              type='password' 
              size='sm'
              value={passConfirm} 
              onChangeText={setPassConfirm} 
            /> */}
            <SharpButton w='100%' my='10px'
              size='sm' onPress={handleSubmit}>
              <Text color='black' fontWeight='medium'>Submit</Text>
            </SharpButton>
          </VStack> : 
          <Box>
            <Text fontSize='lg' mx='auto'>
              Enter Verification code
            </Text>
            <Input 
              w='100%' 
              borderRadius='2px'  
              paddingY='10px' 
              paddingX='16px'
              borderColor='black'
              borderWidth='1px'
              placeholder='Ex 12346' 
              autoCapitalize='none'
              size='sm'
              type='text'
              value={confirmationCode} 
              onChangeText={setConfirmationCode} 
            />
            <SharpButton w='100%' my='10px'
              size='sm' onPress={handlePhoneConfirm}>
              <Text color='black' fontWeight='medium'>Confirm</Text>
            </SharpButton>
          </Box>
      }
      {
        error &&
          <Center>
            <Text color='red.500' textAlign='center' fontSize='xs'>{error}</Text>
          </Center>
      }
    </VStack>
  );
}
