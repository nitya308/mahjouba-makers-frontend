import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { Center, Text, IconButton, Spinner, ScrollView, HStack } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { Job } from 'types/job';
import { authSelector } from 'redux/slices/authSlice';
import { unacceptJob, jobsSelector } from 'redux/slices/jobsSlice';
import { PartType } from 'types/part_type';
import Placeholder from 'assets/no_image_placeholder.png';
import { StyleSheet } from 'react-native';
import Address from 'types/address';
import SharpButton from 'components/SharpButton';
import BaseView from 'components/BaseView';
import { fonts } from 'utils/constants';
import Colors from 'utils/Colors';
import AppModal from 'components/AddModal';
import AudioIcon from '../../../assets/audio_icon.svg';
import TimeRemainingIcon from '../../../assets/time-remaining.svg';
import CameraButton from 'components/CameraButton';
import MapPinIcon from '../../../assets/map_pin.svg';
import MADIcon from '../../../assets/MADIcon.png';
import * as Speech from 'expo-speech';
import { Asset } from 'react-native-image-picker';
import useAppDispatch from 'hooks/useAppDispatch';

export default function CurrentJobPage(): JSX.Element {
  const { userData } = useAppSelector(userDataSelector);
  const fbUserRef = useAppSelector(authSelector).fbUserRef;
  const addressMap = useAppSelector((state) => state.addresses.addressMap);

  const { currentJobId, jobsMap, partsMap, materialsMap, loading } = useAppSelector(jobsSelector);
  const currentJob = jobsMap?.[currentJobId ?? ''];
  const currentPart = partsMap?.[currentJob?.partTypeId];
  const currentAddress = addressMap?.[currentJob?.dropoffAddressId];

  const [completeJobPhoto, setCompleteJobPhoto] = useState<Asset | undefined>();
  const [showModal, setShowModal] = useState(false);

  const dispatch = useAppDispatch();

  if (loading) {
    return (
      <BaseView>
        <Center>
          <Spinner />
        </Center>
      </BaseView>
    );
  }

  return (
    <ScrollView>
      {currentJob ? (
        <BaseView>
          {currentPart?.imageIds.length ? <Image alt='part' source={{ uri: currentPart?.imageIds[0] }} style={styles.image} /> :
            <Image alt='placeholder' source={Placeholder} style={styles.image} />}
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.name}>{currentPart?.name}</Text>
            </View>
            <View style={styles.timeRemaining}>
              <TimeRemainingIcon />
              <Text style={styles.timeRemainingText}>{`${currentPart?.completionTime} hours remaining`}</Text>
            </View>
            <View style={styles.infoBody}>
              <View style={styles.textAndIcon}>
                <MapPinIcon width={28} height={28} />
                <Text style={[styles.text, { maxWidth: '90%' }]}>{currentAddress?.description}</Text>
              </View>
              <View style={styles.textAndIcon}>
                <Image alt='MAD icon' source={MADIcon} />
                <Text style={styles.text}>{`${currentJob?.price} MAD`}</Text>
              </View>
            </View>
          </View>
          <View style={styles.materialContainer}>
            {currentPart?.materialIds?.map((materialId, index) => (
              <View key={index}>
                <Text style={styles.text}>{materialsMap?.[materialId]?.name ?? ''}</Text>
              </View>
            ))}
          </View>
          <Center marginTop={'10px'}>
            <SharpButton
              width={'200px'}
              backgroundColor={Colors.yellow}
              my='2px'
              size='sm'
              onPress={() => {
                dispatch(unacceptJob({ jobId: currentJobId ?? '', fbUserRef }));
              }}
              marginBottom={'10px'}
            >
              <Text fontFamily={fonts.regular}>
                Unaccept Job
              </Text>
            </SharpButton>
          </Center>
          <Center>
            <AppModal
              showModal={showModal}
              setShowModal={setShowModal}
              modalButton={
                <SharpButton
                  width={'200px'}
                  backgroundColor={Colors.yellow}
                  my='2px'
                  size='sm'
                  onPress={() => {
                    setShowModal(true);
                  }}
                >
                  <Text fontFamily={fonts.regular}>
                    Complete Job
                  </Text>
                </SharpButton>
              }
              backgroundColor={Colors.white}
              closeButton={true}
            >
              <HStack alignItems={'center'}>
                <Text fontStyle={fonts.regular} marginTop={'20px'} maxWidth={'220px'}>
                  Please upload at least 1 image of the completed part.
                </Text>
                <IconButton
                  icon={<AudioIcon />}
                  onPress={() => {
                    Speech.speak('My Profile');
                  }}
                />
              </HStack>
              <Center marginTop={'10px'}>
                <CameraButton
                  selectedImageAsset={completeJobPhoto}
                  setSelectedImageAsset={setCompleteJobPhoto}
                />
              </Center>
              <Center marginTop={'10px'}>
                <SharpButton
                  width={'80px'}
                  backgroundColor={Colors.yellow}
                  my='2px'
                  size='sm'
                  onPress={() => {
                    setShowModal(false);
                    setCompleteJobPhoto(undefined);
                    alert('Placeholder submit for now'); // TODO
                  }}
                  marginTop={'10px'}
                >
                  <Text fontFamily={fonts.regular}>
                    Finalize
                  </Text>
                </SharpButton>
              </Center>
            </AppModal>
          </Center>
        </BaseView>
      )
        :
        <BaseView>
          <Center
            marginTop={'100px'}
          >
            <Text>
              You haven't accepted a job yet
            </Text>
          </Center>
        </BaseView>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  infoContainer: {
    width: '90%',
    alignSelf: 'center',
    borderColor: '#000000',
    borderWidth: 1,
    marginBottom: 15,
  },
  materialContainer: {
    width: '90%',
    alignSelf: 'center',
    borderColor: '#000000',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  timeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFC01D',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    padding: 10,
  },
  textAndIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoHeader: {
    backgroundColor: '#FFF4D8',
    paddingTop: 10,
    paddingHorizontal: 10,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  infoBody: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  name: {
    fontSize: 40,
    lineHeight: 40,
  },
  timeRemainingText: {
    fontSize: 20,
    lineHeight: 24,
  },
  text: {
    fontSize: 20,
    lineHeight: 24,
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
  },
});