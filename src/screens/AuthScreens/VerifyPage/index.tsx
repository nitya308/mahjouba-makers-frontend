import React, { useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { resendCode, verify } from 'redux/slices/authSlice';
import AppTextInput from 'components/AppTextInput';
import AppButton from 'components/AppButton';
import FormatStyle from 'utils/FormatStyle';
import TextStyles from 'utils/TextStyles';

const VerifyPage = () => {
  const dispatch = useAppDispatch();
  const { id, email } = useAppSelector((state) => state.auth);
  const [code, setCode] = useState<string>('');

  const handleSubmit = () => {
    // Send only if all fields filled in
    if (!code) alert('Please enter a code!');
    else {
      dispatch(verify({ id, email, code }));
    }
  };

  return (
    <SafeAreaView style={FormatStyle.container}>
      <Text style={TextStyles.title}>Verify</Text>
      <AppTextInput
        onChangeText={(text) => setCode(text)}
        value={code}
        placeholder='Type your code'
      />
      <AppButton
        onPress={handleSubmit}
        title={'Submit'}
      />
      <AppButton
        onPress={() => dispatch(resendCode({ id, email }))}
        title={'Resend Code'}
      />
    </SafeAreaView>
  );
};

export default VerifyPage;
