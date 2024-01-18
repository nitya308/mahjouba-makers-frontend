import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Spinner } from 'native-base';
import { StyleSheet } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { authSelector } from 'redux/slices/authSlice';
import { jobsSelector, acceptJob, unacceptJob } from 'redux/slices/jobsSlice';
import { getUser, updateUser, userDataSelector } from 'redux/slices/userDataSlice';
import { JOB_STATUS_ENUM } from 'types/job';
import SharpButton from 'components/SharpButton';
import { fonts } from 'utils/constants';
import { Job } from 'types/job';
import { PartType } from 'types/part_type';
import Address from 'types/address';
import { SafeAreaView } from 'react-native-safe-area-context';
import XIcon from 'assets/x.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Placeholder from 'assets/no_image_placeholder.png';
import TimeRemainingIcon from '../../../assets/time-remaining.svg';
import MapPinIcon from '../../../assets/map_pin.svg';
import MADIcon from '../../../assets/MADIcon.png';
import Colors from 'utils/Colors';

const JobDetailsPage = ({
  jobId,
  exit,
}: {
  jobId: string;
  exit: () => void;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);
  const { jobsMap, partsMap, materialsMap, loading, currentJobId } = useAppSelector(jobsSelector);
  const addressMap = useAppSelector((state) => state.addresses.addressMap);

  if (loading) {
    return <Spinner />;
  }

  const job = jobsMap[jobId];
  const part = partsMap[job.partTypeId];
  const materials = part?.materialIds?.map((materialId: string) => {
    const material = materialsMap[materialId];
    return material ? material.name : ''; // Return the name if available, otherwise an empty string
  });
  const address = addressMap?.[job?.dropoffAddressId];
  const photoMap = useAppSelector((state) => state.photos.photosMap);
  // Display different image depending on current jobStatus
  const imageUrl = (job?.jobStatus === JOB_STATUS_ENUM.COMPLETE || job?.jobStatus === JOB_STATUS_ENUM.PENDING_REVIEW)
    ? (photoMap?.[job?.imageIds[0]]?.fullUrl)
    : (photoMap?.[part?.imageIds[0]]?.fullUrl);

  return (
    <SafeAreaView style={styles.container}>
      {part && job ? (
        <>
          <TouchableOpacity style={styles.exit} onPress={exit}>
            <XIcon width={30} height={30} />
          </TouchableOpacity>
          {!part.imageIds.length ? <Image alt='placeholder' source={Placeholder} style={styles.image} /> : <Image alt='part' source={{ uri: imageUrl }} style={styles.image} />}
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.name}>{part.name}</Text>
            </View>
            <View style={styles.infoBody}>
              <View style={styles.textAndIcon}>
                <TimeRemainingIcon />
                <Text style={styles.text}>{`${part.completionTime} hours`}</Text>
              </View>
              <View style={styles.textAndIcon}>
                <MapPinIcon width={28} height={28} />
                <Text style={[styles.text, { maxWidth: '90%' }]}>{address?.description}</Text>
              </View>

              <View style={styles.textAndIcon}>
                <Image alt='MAD icon' source={MADIcon} style={{ width: 28, height: 28 }} />
                <Text style={styles.text}>{`${job.price} MAD`}</Text>
              </View>
            </View>
          </View>
          <View style={styles.materialContainer}>
            {materials.map((material) => (
              <View key={material}>
                <Text style={styles.text}>{material}</Text>
              </View>
            ))}
          </View>
          {jobId !== currentJobId ?
            <View style={styles.acceptButton}>
              <SharpButton
                width={'120px'}
                backgroundColor={Colors.yellow}
                my='2px'
                size='sm'
                onPress={() => {
                  dispatch(acceptJob({ jobId: jobId ?? '', fbUserRef }));
                }}
                marginTop={'10px'}
              >
                <Text fontFamily={fonts.regular}>
                  Accept Job
                </Text>
              </SharpButton>
            </View>
            :
            <View style={styles.acceptButton}>
              <Text>You have accepted this job.</Text>
              <SharpButton
                width={'120px'}
                backgroundColor={Colors.yellow}
                my='2px'
                size='sm'
                onPress={() => {
                  dispatch(unacceptJob({ jobId: currentJobId ?? '', fbUserRef }));
                }}
                marginTop={'10px'}
              >
                <Text fontFamily={fonts.regular}>
                  UnAccept Job
                </Text>
              </SharpButton>
            </View>
          }
        </>
      ) : (
        <Text style={styles.text}>Loading{job?.partTypeId}</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  exit: {
    padding: 10,
  },
  acceptButton: {
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: Colors.backgroundWhite,
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
  textAndIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoHeader: {
    backgroundColor: '#FFF4D8',
    padding: 10,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  infoBody: {
    padding: 10,
  },
  timeRemainingText: {
    fontSize: 20,
    lineHeight: 24,
  },
  image: {
    width: '200%',
    height: 200,
    marginBottom: 20,
  },
  name: {
    fontSize: 30,
    lineHeight: 30,
  },
  text: {
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
  },
});

export default JobDetailsPage;
