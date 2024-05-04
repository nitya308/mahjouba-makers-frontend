import TextHighlighter from 'components/SpeechHighlighter';
import { IconButton } from 'native-base';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import AppStyles from 'styles/commonstyles';
import AudioIcon from '../../../assets/audio_icon.svg';

const PaymentPage = () => {

  const { t } = useTranslation();
  const [pressed, setPressed] = useState(false);

  return (
    <SafeAreaView>
      <ScrollView style={AppStyles.mainContainer}>
        <TextHighlighter style={AppStyles.left_heading} text={t('Earnings')} pressed={pressed} setPressed={setPressed} />
      </ScrollView>
      <IconButton
        icon={<AudioIcon />}
        onPress={() => {
          setPressed(true);
        }}
        style={AppStyles.audioButtonStyle}
      />
    </SafeAreaView>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({});
