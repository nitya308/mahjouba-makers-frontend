/* eslint-disable import/no-extraneous-dependencies */
import SharpButton from 'components/SharpButton';
import TextHighlighter from 'components/SpeechHighlighter';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import AppStyles from 'styles/commonstyles';
import HammerIcon from '../../../assets/hammer2.svg';
import { Pressable, HStack, VStack } from 'native-base';
import WorkshopCard from 'components/WorkshopCard';
import Modal from 'react-native-modal';
import { workshopsSelector } from 'redux/slices/workshopsSlice';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector } from 'redux/slices/authSlice';

const BulletinPage = () => {
  const [pressed, setPressed] = useState(false);
  const { t } = useTranslation();
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | undefined>();
  const { workshopsMap } = useAppSelector(workshopsSelector);
  console.log('workshopsMap:', workshopsMap);

  return (
    <View>
      <SafeAreaView>
        <ScrollView style={AppStyles.mainContainer}>

          <View style={AppStyles.row}>
            <TextHighlighter style={AppStyles.left_heading} text={t('Workshops')} pressed={pressed} setPressed={setPressed} />
            <SharpButton my='10px'
              size='sm' onPress={() => console.log('pressed')}>
              <TextHighlighter style={AppStyles.buttonText} text={t('Current Sign Ups')} pressed={pressed} setPressed={setPressed} />
            </SharpButton>
          </View>

          <TextHighlighter
            text={t('Sign up for Workshops to learn new skills, crafting techniques, or to simply bond with other craftsmen in your area.')}
            pressed={pressed} setPressed={setPressed} />

          <VStack space={6} marginTop={5}>
            {Object.values(workshopsMap).map((workshop) => (
              <WorkshopCard key={workshop._id} workshop={workshop} pressed={pressed} setPressed={setPressed} />
            ))}
          </VStack>

        </ScrollView>
        <Modal
          style={{ justifyContent: 'flex-end', margin: 0 }}
          backdropOpacity={0}
          isVisible={selectedWorkshopId != undefined}>
          <Text>Modal</Text>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default BulletinPage;


