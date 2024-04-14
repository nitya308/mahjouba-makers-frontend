import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, Input, VStack, Center, Box, ScrollView, IconButton, Spacer } from 'native-base';
import { phonePassSignup } from 'utils/auth';
import SharpButton from 'components/SharpButton';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { app, auth } from '../../../firebase';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { SafeAreaView, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from 'styles/onboarding';
import Colors from 'utils/Colors';
import AudioIcon from '../../assets/audio_icon.svg';
import TextHighlighter from 'components/SpeechHighlighter';
import AppStyles from 'styles/commonstyles';

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
      <ScrollView style={AppStyles.mainContainer}>
        <VStack space={4}>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={app.options}
            attemptInvisibleVerification
          />
          {
            !phoneVerify ?
              <View>
                <VStack space={10} alignItems="center">
                  <Spacer size={20} />
                  <TextHighlighter style={styles.heading} text={t('Welcome back')} pressed={pressed} setPressed={setPressed} />
                  <TextHighlighter style={styles.heading} text={t('Login here')} pressed={pressed} setPressed={setPressed} />
                  <Spacer size={10} />
                </VStack>

                <TextHighlighter style={styles.inputLabel} text={t('Phone Number')} pressed={pressed} setPressed={setPressed} />
                <TextInput
                  style={styles.inputBoxStyle}
                  placeholder='Phone #'
                  value={phone}
                  onChangeText={setPhone}
                />
                <Spacer size={5} />
                <VStack space={0} alignItems="center" mt={0} mb={0}>
                  <SharpButton w='90px' h='42px' size='sm' onPress={handleSubmit}>
                    <TextHighlighter style={AppStyles.buttonText} text={t('Send')} pressed={pressed} setPressed={setPressed} />
                  </SharpButton>
                </VStack>
              </View>
              :
              <View>
                <VStack space={0} alignItems="center" mt='100px'>
                  <TextHighlighter style={styles.heading} text={t('Check your phone')} pressed={pressed} setPressed={setPressed} />
                  <TextHighlighter style={styles.heading} text={t('for a')} pressed={pressed} setPressed={setPressed} />
                </VStack>
                <Spacer size={10} />
                <TextHighlighter style={styles.inputLabel} text={t('Confirmation Code')} pressed={pressed} setPressed={setPressed} />
                <TextInput
                  style={styles.inputBoxStyle}
                  placeholder='Ex 12346'
                  value={confirmationCode}
                  onChangeText={setConfirmationCode}
                />
                <Spacer size={5} />
                <VStack space={0} alignItems="center" mt={0} mb={0}>
                  <SharpButton w='90px' size='sm' onPress={handlePhoneConfirm}>
                    <TextHighlighter style={AppStyles.buttonText} text={t('Enter')} pressed={pressed} setPressed={setPressed} />
                  </SharpButton>
                </VStack>
              </View>
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