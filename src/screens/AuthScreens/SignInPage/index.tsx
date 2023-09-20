import React, { useEffect, useState } from 'react';
import useAppDispatch from 'hooks/useAppDispatch';
import { signIn } from 'redux/slices/authSlice';
import AppTextInput from 'components/AppTextInput';
import AppButton from 'components/AppButton';
import BaseView from 'components/BaseView';
import Colors from 'utils/Colors';
import { View, StyleSheet } from 'react-native';
import BackButton from 'components/NavButtons/BackButton';

const SignInPage = () => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = () => {
    // Send only if all fields filled in
    if (!email) setErrors((e) => { return { ...e, email: 'Please enter a email address.' }; });
    if (!password) setErrors((e) => { return { ...e, password: 'Please enter a password.' }; });

    if (email && password) {
      dispatch(signIn({ email, password }));
    }
  };

  useEffect(() => {
    setErrors((e) => { return { ...e, email: '' }; });
  }, [email]);

  useEffect(() => {
    setErrors((e) => { return { ...e, password: '' }; });
  }, [password]);

  return (
    <BaseView logoText={'App Title'}>
      <View style={{ width: '90%' }}>
        <AppTextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder='Email'
          errorText={errors.email}
        />
        <AppTextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder='Password'
          secureTextEntry={true}
          errorText={errors.password}
        />
        <AppButton
          onPress={handleSubmit}
          title={'Log In'}
          textColor='white'
          backgroundColor={Colors.primary}
          fullWidth
        />
      </View>

      <View style={styles.backView}>
        <BackButton />
      </View>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  backView: {
    position: 'absolute',
    bottom: 30,
    left: 30,
  },
});


export default SignInPage;
