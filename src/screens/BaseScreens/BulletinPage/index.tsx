/* eslint-disable import/no-extraneous-dependencies */
import SharpButton from 'components/SharpButton';
import TextHighlighter from 'components/SpeechHighlighter';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import AppStyles from 'styles/commonstyles';
import HammerIcon from '../../../assets/hammer2.svg';
import { Pressable, HStack, VStack } from 'native-base';
import WorkshopCard from 'components/WorkshopCard';
import Modal from 'react-native-modal';
import { workshopsSelector } from 'redux/slices/workshopsSlice';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector } from 'redux/slices/authSlice';
import WorkshopDetailsPage from '../WorkshopDetailsPage';

const BulletinPage = ({ reloadWorkshops, refreshing }: { reloadWorkshops: () => void; refreshing: boolean }) => {
  const [pressed, setPressed] = useState(false);
  const { t } = useTranslation();
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | undefined>();
  const { id } = useAppSelector(authSelector);
  const { workshopsMap } = useAppSelector(workshopsSelector);
  const [currentSignUpsPressed, setCurrentSignUpsPressed] = useState(false);
  const signedUpWorkshops: string[] = Object.entries(workshopsMap).reduce((acc: string[], [key, workshop]) => {
    if (workshop.participantIds?.includes(id)) {
      acc.push(key);  // Collect the workshop ID
    }
    return acc;
  }, []);
  console.log('workshopsMap:', workshopsMap);

  return (
    <View>
      <SafeAreaView>
        <ScrollView style={AppStyles.mainContainer} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={reloadWorkshops} />}>

          <View style={AppStyles.row}>
            <TextHighlighter style={AppStyles.left_heading} text={t('Workshops')} pressed={pressed} setPressed={setPressed} />
            <SharpButton my='10px'
              size='sm' onPress={() => setCurrentSignUpsPressed(true)}>
              <TextHighlighter style={AppStyles.buttonText} text={t('Current Sign Ups')} pressed={pressed} setPressed={setPressed} />
            </SharpButton>
          </View>

          <TextHighlighter
            text={t('Sign up for Workshops to learn new skills, crafting techniques, or to simply bond with other craftsmen in your area.')}
            pressed={pressed} setPressed={setPressed} />

          <VStack space={6} marginTop={5}>
            {Object.values(workshopsMap).map((workshop) => (
              <Pressable key={workshop._id} onPress={() => setSelectedWorkshopId(workshop._id)}>
                <WorkshopCard key={workshop._id} workshop={workshop} pressed={pressed} setPressed={setPressed} setSelectedWorkshopId={(workshopId: string) => setSelectedWorkshopId(workshopId)} />
              </Pressable>
            ))}
          </VStack>

        </ScrollView>

        <Modal
          style={{ justifyContent: 'flex-end', margin: 0 }}
          backdropOpacity={0}
          isVisible={selectedWorkshopId != undefined}>
          {selectedWorkshopId &&
            <WorkshopDetailsPage workshopId={selectedWorkshopId ?? ''} exit={() => setSelectedWorkshopId(undefined)} />
          }
        </Modal>

        <Modal
          style={{ justifyContent: 'flex-end', margin: 0 }}
          backdropOpacity={0}
          isVisible={currentSignUpsPressed}
        >
          {signedUpWorkshops.map((registeredWorkshopId) => {
            const registeredWorkshop = workshopsMap[registeredWorkshopId];
            return (
              <Pressable key={registeredWorkshopId} onPress={() => setSelectedWorkshopId(registeredWorkshopId)}>
                <WorkshopCard
                  key={registeredWorkshopId}
                  workshop={registeredWorkshop}
                  pressed={pressed}
                  setPressed={setPressed}
                  setSelectedWorkshopId={(workshopId: string) => setSelectedWorkshopId(workshopId)}
                />
              </Pressable>
            );
          })}
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default BulletinPage;


