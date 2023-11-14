import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { Box, Center, Text, IconButton, Spinner, ScrollView, HStack } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { Job } from 'types/job';
import { addressApi, jobsApi } from 'requests';
import { authSelector } from 'redux/slices/authSlice';
import { jobsSelector } from 'redux/slices/jobsSlice';
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

export default function CurrentJobPage(): JSX.Element {
  const { userData } = useAppSelector(userDataSelector);
  const { fbUserRef } = useAppSelector(authSelector);

  const { partsMap, materialsMap } = useAppSelector(jobsSelector);

  // console.log('PARTS MAP', partsMap);
  // console.log('MATERIALS MAP', materialsMap);

  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [currentPart, setCurrentPart] = useState<PartType | null>(null);
  const [currentMaterials, setCurrentMaterials] = useState<string[]>([]);
  const [address, setAddress] = useState<Address | undefined>(undefined);

  const [jobLoading, setJobLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [completeJobPhoto, setCompleteJobPhoto] = useState<Asset | undefined>();

  useEffect(() => {
    const pullJobForUser = async () => {
      if (!userData?.currentJobId || !fbUserRef) return;
      setJobLoading(true);
      try {
        const pulledJob = await jobsApi.getJob(userData.currentJobId, fbUserRef);
        const pulledAddress = await addressApi.getAddress(pulledJob.dropoffAddressId, fbUserRef);
        if (pulledJob) {
          setCurrentJob(pulledJob);
        }
        if (pulledAddress) {
          setAddress(pulledAddress);
        }
        setJobLoading(false);
      } catch (err) {
        setJobLoading(false);
        console.log(err);
      }
    };
    pullJobForUser();
  }, [userData]);

  useEffect(() => {
    if (!currentJob || !(currentJob.partTypeId in partsMap)) return;
    setCurrentPart(partsMap[currentJob.partTypeId]);
  }, [currentJob, partsMap]);

  useEffect(() => {
    if (!currentPart) return;
    const materials = currentPart.materialIds.map((materialId: string) => {
      const material = materialsMap[materialId];
      return material ? material.name : '';
    });
    setCurrentMaterials(materials);
  }, [currentPart, materialsMap]);

  // console.log('Current Job', currentJob);
  // console.log('Current Part', currentPart);
  // console.log('Current Materials', currentMaterials);

  return (
    <ScrollView>
      {jobLoading ? (
        <Spinner />
      ) : (
        <BaseView>
          { currentPart?.imageIds.length ? <Image alt='part' source={{ uri: currentPart?.imageIds[0] }} style={styles.image} /> : 
            <Image alt='placeholder' source={Placeholder} style={styles.image} /> }
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
                <MapPinIcon width={28} height={28}/>
                <Text style={[styles.text, { maxWidth: '90%' }]}>{address?.description}</Text>
              </View>
              <View style={styles.textAndIcon}>
                <Image source={MADIcon}/>
                <Text style={styles.text}>{`${currentJob?.price} MAD`}</Text>
              </View>
            </View>
          </View>
          <View style={styles.materialContainer}>
            {currentMaterials.map((material, index) => (
              <View key={index}>
                <Text style={styles.text}>{material}</Text>
              </View>
            ))}
          </View>
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
                    console.log('here1'); // TODO: Temp
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
      )}
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