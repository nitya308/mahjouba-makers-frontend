/* eslint-disable import/no-extraneous-dependencies */
import TextHighlighter from 'components/SpeechHighlighter';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import AppStyles from 'styles/commonstyles';
import { Pressable, VStack, Button, IconButton } from 'native-base';
import AudioIcon from '../../../assets/audio_icon.svg';
import StopIcon from '../../../assets/hand_icon.svg';
import * as Speech from 'expo-speech';
import WorkshopCard from 'components/WorkshopCard';
import Modal from 'react-native-modal';
import { workshopsSelector } from 'redux/slices/workshopsSlice';
import useAppSelector from 'hooks/useAppSelector';
import WorkshopDetailsPage from '../WorkshopDetailsPage';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { fonts } from 'utils/constants';
import Colors from 'utils/Colors';

const BulletinPage = ({ reloadWorkshops, refreshing }: { reloadWorkshops: () => void; refreshing: boolean }) => {
  const [pressed, setPressed] = useState(false);
  const { t } = useTranslation();
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | undefined>();
  const userId = useAppSelector(userDataSelector).userData?._id;
  const { workshopsMap } = useAppSelector(workshopsSelector);
  const [currentSignUpsPressed, setCurrentSignUpsPressed] = useState(false);

  const [availableWorkshops, setAvailableWorkshops] = useState<string[]>([]);
  const [signedUpWorkshops, setSignedUpWorkshops] = useState<string[]>([]);

  useEffect(() => {
    setAvailableWorkshops([]);
    setSignedUpWorkshops([]);
    Object.values(workshopsMap).forEach((workshop) => {
      if (userId && workshop.participantIds?.includes(userId)) {
        setSignedUpWorkshops((prev) => [...prev, workshop._id]);
      } else {
        setAvailableWorkshops((prev) => [...prev, workshop._id]);
      }
    });
  }, [workshopsMap]);

  return (
    <View>
      <SafeAreaView >
        <View style={[AppStyles.row, styles.paddingPage]}>
          <Pressable onPress={() => { setCurrentSignUpsPressed(false); }}>
            <TextHighlighter style={AppStyles.left_heading} text={t('Workshops')} pressed={pressed} setPressed={setPressed} />
          </Pressable>

          <Button onPress={() => { setCurrentSignUpsPressed(true); }}
            style={currentSignUpsPressed ? styles.tabButtonPressed : styles.tabButton}>
            <TextHighlighter style={styles.tabText} text={t('Current Sign Ups')} pressed={pressed} setPressed={setPressed} />
          </Button>

        </View>
        <ScrollView
          style={[AppStyles.mainContainer, currentSignUpsPressed ? styles.tabBackground : {}]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={reloadWorkshops} />}>
          <VStack space={6} marginTop={5}>
            {currentSignUpsPressed ?
              <VStack space={6} marginTop={5}>
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
              </VStack>
              :
              <VStack space={6}>
                <TextHighlighter
                  text={t('Sign up for Workshops to learn new skills, crafting techniques, or to simply bond with other craftsmen in your area.')}
                  pressed={pressed} setPressed={setPressed} />
                {availableWorkshops.map((workshopId) => (
                  workshopId &&
                  <Pressable key={workshopId} onPress={() => setSelectedWorkshopId(workshopId)}>
                    <WorkshopCard key={workshopId}
                      workshop={workshopsMap[workshopId]}
                      pressed={pressed} setPressed={setPressed}
                      setSelectedWorkshopId={(id: string) => setSelectedWorkshopId(id)} />
                  </Pressable>
                ))}
              </VStack>
            }
          </VStack>
        </ScrollView>
        <IconButton
          icon={!pressed ? <AudioIcon /> : <StopIcon />}
          onPress={() => {
            if (pressed) {
              Speech.stop();
              setPressed(false);
            } else {
              setPressed(true);
            }
          }}
          style={AppStyles.audioButtonStyle}
        />
        <Modal
          style={{ justifyContent: 'flex-end', margin: 0 }}
          backdropOpacity={0}
          isVisible={selectedWorkshopId != undefined}>
          {selectedWorkshopId &&
            <WorkshopDetailsPage workshopId={selectedWorkshopId ?? ''} exit={() => setSelectedWorkshopId(undefined)} reloadWorkshops={reloadWorkshops} />
          }
        </Modal>

        {/* <Modal
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
        </Modal> */}
      </SafeAreaView>
    </View>
  );
};

export default BulletinPage;

const styles = StyleSheet.create({
  tabButton: {
    borderColor: '#91EAF9',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    borderRadius: 10,
    padding: 2.5,
  },
  tabButtonPressed: {
    borderColor: '#91EAF9',
    borderWidth: 2,
    backgroundColor: 'rgba(145, 234, 249, 0.4)',
    color: '#000000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 2.5,
  },
  tabBackground: {
    backgroundColor: 'rgba(145, 234, 249, 0.3)',
  },
  tabText: { color: Colors.black, fontSize: 18, fontFamily: fonts.bold },
  paddingPage: { paddingHorizontal: 20, paddingTop: 20 },
});

