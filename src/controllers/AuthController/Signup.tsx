import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView } from 'native-base';
import { phonePassSignup, userPassSignUp } from 'utils/auth';
import SharpButton from 'components/SharpButton';
import IDSetup from '..//SetupController/IDSetup';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { app, auth } from '../../../firebase';
import { ConfirmationResult, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import useAppDispatch from 'hooks/useAppDispatch';
import { setName as setReduxName } from 'redux/slices/authSlice';
import { SafeAreaView } from 'react-native';
import Colors from 'utils/Colors';
import { StyleSheet } from 'react-native';

const Signup = () => {
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
    <SafeAreaView>
      <ScrollView>
        <VStack space={2}>

          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={app.options}
          // attemptInvisibleVerification
          />
          {
            !phoneVerify ?
              <VStack space={2} mb='10px' alignItems='center' mt='73px'>
                <Text color='white' fontSize='30px' textAlign='center'>
                  Enter your name {'\n'} and phone number
                </Text>
                <Box height='100px' />
                <Text color='white' fontSize='24px' style={styles.underline}>
                  Name
                </Text>
                <Input
                  w='190px'
                  borderRadius='2px'
                  paddingY='10px'
                  paddingX='16px'
                  borderColor={Colors.outline}
                  borderWidth='1px'
                  placeholderTextColor='#737B7D'
                  placeholder='Name'
                  color='white'
                  autoCapitalize='none'
                  size='sm'
                  type='text'
                  value={name}
                  onChangeText={setName}
                />
                <Text color='white' fontSize='24px' style={styles.underline}>
                  Phone Number
                </Text>
                <Input
                  w='190px'
                  borderRadius='2px'
                  paddingY='10px'
                  paddingX='16px'
                  borderColor={Colors.outline}
                  borderWidth='1px'
                  placeholderTextColor='#737B7D'
                  placeholder='Phone #'
                  autoCapitalize='none'
                  color='white'
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
                <SharpButton w='160px' my='10px'
                  size='sm' onPress={handleSubmit}>
                  <Text color='white' fontWeight='medium'>Submit</Text>
                </SharpButton>
              </VStack> :
              <VStack space={2} mb='10px' alignItems='center' mt='73px'>
                <Box alignItems='center' >
                  <Text fontSize='24px' mx='auto' color='white' textAlign='center' >
                    Enter Verification code
                  </Text>
                  <Box height='20px'/>
                  <Input
                    w='190px'
                    borderRadius='2px'
                    paddingY='10px'
                    paddingX='16px'
                    borderColor={Colors.outline}
                    color='white'
                    borderWidth='1px'
                    placeholder='Ex 12346'
                    autoCapitalize='none'
                    size='sm'
                    type='text'
                    value={confirmationCode}
                    onChangeText={setConfirmationCode}
                  />
                  <SharpButton w='160px' my='10px'
                    size='sm' onPress={handlePhoneConfirm}>
                    <Text color='white' fontWeight='medium'>Confirm</Text>
                  </SharpButton>
                </Box>
              </VStack>
          }
          {
            error &&
            <Center>
              <Text color='red.500' textAlign='center' fontSize='xs'>{error}</Text>
            </Center>
          }
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  italic: { fontStyle: 'italic' },
  underline: { textDecorationLine: 'underline' },
});

export default Signup;