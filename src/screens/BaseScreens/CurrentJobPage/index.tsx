import React, { useEffect, useState } from 'react';
import { View, Image, SafeAreaView } from 'react-native';
import { Box, Center, Text, Heading, Spinner } from 'native-base';
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



export default function CurrentJobPage(): JSX.Element {
  const { userData } = useAppSelector(userDataSelector);
  const { fbUserRef } = useAppSelector(authSelector);

  const { partsMap, materialsMap } = useAppSelector(jobsSelector);

  console.log('PARTS MAP', partsMap);
  console.log('MATERIALS MAP', materialsMap);

  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [currentPart, setCurrentPart] = useState<PartType | null>(null);
  const [currentMaterials, setCurrentMaterials] = useState<string[]>([]);
  const [address, setAddress] = useState<Address | undefined>(undefined);

  const [jobLoading, setJobLoading] = useState(false);

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

  console.log('Current Job', currentJob);
  console.log('Current Part', currentPart);
  console.log('Current Materials', currentMaterials);

  return (
    <SafeAreaView>
      {jobLoading ? (
        <Spinner />
      ) : (
        <View style={styles.container}>
          { currentPart?.imageIds.length ? <Image alt='part' source={{ uri: currentPart?.imageIds[0] }} style={styles.image} /> : 
            <Image alt='placeholder' source={Placeholder} style={styles.image} /> }
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.name}>{currentPart?.name}</Text>
            </View>
            <View style={styles.timeRemaining}>
              <Text style={styles.timeRemainingText}>{`${currentPart?.completionTime} hours remaining`}</Text>
            </View>
            <View style={styles.infoBody}>
              <Text style={styles.text}>{`${currentPart?.completionTime} hours`}</Text>
              <Text style={styles.text}>{address?.description}</Text>
              <Text style={styles.text}>{`${currentJob?.price} MAD`}</Text>
            </View>
          </View>
          <View style={styles.materialContainer}>
            {currentMaterials.map((material, index) => (
              <View key={index}>
                <Text style={styles.text}>{material}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
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
    backgroundColor: '#FFC01D',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    padding: 10,
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
  image: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  name: {
    fontSize: 30,
    lineHeight: 28,
  },
  timeRemainingText: {
    fontSize: 20,
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