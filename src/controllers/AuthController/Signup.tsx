import React, { useCallback, useRef, useState, useEffect, useTransition } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView, Spacer } from 'native-base';
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
import AudioIcon from '../../assets/audio_icon.svg';
import { IconButton } from 'native-base';
import TextHighlighter from 'components/SpeechHighlighter';
import { useTranslation } from 'react-i18next';
import styles from 'styles/onboarding';

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
  const [pressed, setPressed] = useState(false);

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

  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <IconButton
        style={styles.audioStyle}
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
      />
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
                <TextHighlighter style={styles.heading} text={t('Enter your name \n and phone number')} pressed={pressed} setPressed={setPressed} />
                <Box height='70px' />
                <TextHighlighter style={styles.subheading} text={t('Name')} pressed={pressed} setPressed={setPressed} />
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
                <TextHighlighter style={styles.subheading} text={t('Phone Number')} pressed={pressed} setPressed={setPressed} />
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
                  <TextHighlighter style={styles.buttonText} text={t('Submit')} pressed={pressed} setPressed={setPressed} />
                </SharpButton>
              </VStack> :
              <VStack space={2} mb='10px' alignItems='center' mt='73px'>
                <Box alignItems='center' >
                  <TextHighlighter style={styles.heading} text={t('Confirmation Code')} pressed={pressed} setPressed={setPressed} />
                  <Box height='20px' />
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
                    <TextHighlighter style={styles.subheading} text={t('Enter')} pressed={pressed} setPressed={setPressed} />
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

export default Signup;