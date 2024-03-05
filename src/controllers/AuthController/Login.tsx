import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Button, Box, ScrollView, IconButton } from 'native-base';
import { phonePassSignup, userPassSignUp } from 'utils/auth';
import SharpButton from 'components/SharpButton';
import IDSetup from 'controllers/SetupController/IDSetup';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { app, auth } from '../../../firebase';
import { ConfirmationResult, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from 'styles/onboarding';
import Colors from 'utils/Colors';
import AudioIcon from '../../assets/audio_icon.svg';
import TextHighlighter from 'components/SpeechHighlighter';

const Login = () => {
  const recaptchaVerifier = useRef<any>(null);
  const [phone, setPhone] = useState<string | undefined>('1111111111');
  const [confirmationCode, setConfirmationCode] = useState<string | undefined>('123456');
  // const [password, setPassword] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [confirmResult, setConfirmResult] = useState<string | undefined>();
  const { t } = useTranslation();
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
    if (!phone) {
      setError('Complete required fields');
      return;
    }
    try {
      // console.log(recaptchaVerifier.current);
      const result = await phonePassSignup(phone, recaptchaVerifier.current);
      console.log(result);
      setConfirmResult(result);
      setPhoneVerify(true);
    } catch (err) {
      setError((err as any).message);
    }
  }, [phone, recaptchaVerifier]);

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
      <IconButton
        style={styles.audioStyle}
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <VStack space={4} alignItems='center'>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={app.options}
            attemptInvisibleVerification
          />
          {
            !phoneVerify ?
              <VStack space={2} alignItems="center">
                <Box height='30px' />
                <TextHighlighter style={styles.heading} text={t('Hey again!')} pressed={pressed} setPressed={setPressed} />
                <Box height='10px' />
                <TextHighlighter style={styles.heading} text={t('Enter your phone \n number to sign in')} pressed={pressed} setPressed={setPressed} />
                <Box height='20px' />
                <TextHighlighter style={styles.subheading} text={t('Phone Number')} pressed={pressed} setPressed={setPressed} />
                <Input
                  w="204px"
                  h="42px"
                  borderRadius='2px'
                  py='10px'
                  px='16px'
                  borderColor={Colors.outline}
                  borderWidth='1px'
                  placeholder='Phone #'
                  autoCapitalize='none'
                  size='md'
                  type='text'
                  color='white'
                  value={phone}
                  onChangeText={setPhone}
                />
                <Box height='50px' />
                <SharpButton w='90px' h='42px' size='sm' onPress={handleSubmit}>
                  <TextHighlighter style={styles.buttonText} text={t('Send')} pressed={pressed} setPressed={setPressed} />
                </SharpButton>
              </VStack>
              :
              <VStack space={2} alignItems='center'>
                <TextHighlighter style={styles.heading} text={t('Confirmation')} pressed={pressed} setPressed={setPressed} />
                <TextHighlighter style={styles.subheading} text={t('Code')} pressed={pressed} setPressed={setPressed} />
                <Box height='30px' />
                <Input
                  w="204px"
                  h="42px"
                  borderRadius='2px'
                  py='10px'
                  px='16px'
                  borderColor={Colors.outline}
                  borderWidth='1px'
                  placeholder='Ex 12346'
                  autoCapitalize='none'
                  size='md'
                  color='white'
                  type='text'
                  value={confirmationCode}
                  onChangeText={setConfirmationCode}
                />
                <Box height='30px' />
                <SharpButton w='90px' h='42px' size='sm' onPress={handlePhoneConfirm}>
                  <TextHighlighter style={styles.buttonText} text={t('Enter')} pressed={pressed} setPressed={setPressed} />
                </SharpButton>
              </VStack>
          }
          {error && (
            <Center>
              <Text color='red.500' textAlign='center' fontSize='xs'>{error}</Text>
            </Center>
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;