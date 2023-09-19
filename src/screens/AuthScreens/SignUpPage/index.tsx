import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import useAppDispatch from 'hooks/useAppDispatch';
import { signUp } from 'redux/slices/authSlice';
import AppTextInput from 'components/AppTextInput';
import AppButton from 'components/AppButton';
import BaseView from 'components/BaseView';
import Colors from 'utils/Colors';
import BackButton from 'components/NavButtons/BackButton';

const SignUpPage = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = () => {
    // Send only if all fields filled in
    if (!name) setErrors((e) => { return { ...e, name: 'Please enter a name.' }; });
    else if (!email) setErrors((e) => { return { ...e, email: 'Please enter a email address.' }; });
    else if (!password) setErrors((e) => { return { ...e, password: 'Please enter a password.' }; });
    else if (!confirmPassword) setErrors((e) => { return { ...e, confirmPassword: 'Please enter a password.' }; });
    else if (!(password === confirmPassword)) alert('Passwords do not match!');
    else {
      dispatch(signUp({ email, password, name }));
    }
  };

  return (
    <BaseView logoText={'Vibe'}>
      <View style={{ width: '90%' }}>
        <AppTextInput
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder='Name'
          secureTextEntry={true}
          errorText={errors.name}
        />
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
        <AppTextInput
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          placeholder='Confirm Password'
          secureTextEntry={true}
          errorText={errors.confirmPassword}
        />
        <AppButton
          onPress={handleSubmit}
          title={'Sign Up'}
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

export default SignUpPage;
