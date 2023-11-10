import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Button, Center, Spinner } from 'native-base';
import { StyleSheet } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { authSelector } from 'redux/slices/authSlice';
import { jobsSelector } from 'redux/slices/jobsSlice';
import { getUser, updateUser, userDataSelector } from 'redux/slices/userDataSlice';
import { addressApi, jobsApi, usersApi } from 'requests';
import { Job } from 'types/job';
import { PartType } from 'types/part_type';
import Address from 'types/address';
import { SafeAreaView } from 'react-native-safe-area-context';
import XIcon from 'assets/x.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Placeholder from 'assets/no_image_placeholder.png';

const JobDetailsPage = ({
  exit,
}: {
  exit: () => void;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);
  const { partsMap, materialsMap } = useAppSelector(jobsSelector);
  const [job, setJob] = useState<Job>();
  const [address, setAddress] = useState<Address | undefined>();
  const [part, setPart] = useState<PartType | undefined>();
  const [materials, setMaterials] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) return;
    const pullJob = async () => {
      if (!fbUserRef) return;
      try {
        setLoading(true);
        // TODO: Incorrect Typescript typing
        const dbJob = await jobsApi.getJob((job as any)._id, fbUserRef);
        const dbAddress = await addressApi.getAddress(dbJob.dropoffAddressId, fbUserRef);
        if (dbJob) {
          setJob(dbJob);
        }
        if (dbAddress) {
          setAddress(dbAddress);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    pullJob();
  }, [job, fbUserRef]); // TODO: Had to replace jobId with job._id

  useEffect(() => {
    if (!job || !(job.partTypeId in partsMap)) return;
    setPart(partsMap[job.partTypeId]);

  }, [job, partsMap]);

  useEffect(() => {
    if (!part) return;
    const newMaterials: string[] = [];
    part.materialIds.forEach((materialId) => {
      if (materialId in materialsMap) {
        newMaterials.push(materialsMap[materialId].name);
      }
    });
    setMaterials(newMaterials);
  }, [part, materialsMap]);

  const acceptJob = useCallback(async () => {
    if (!fbUserRef) return;
    try {
      dispatch(updateUser({
        updates: {
          currentJobId: job?._id,
        },
        fbUserRef,
      }));
    } catch (err) {
      console.log(err);
    }
  }, [job, fbUserRef]);

  console.log(job, part, address, materials);

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Spinner />}
      {part && job ? (
        <>
          <TouchableOpacity style={styles.exit} onPress={exit}>
            <XIcon width={30} height={30} />
          </TouchableOpacity>
          { !part.imageIds.length ? <Image alt='placeholder' source={Placeholder} style={styles.image} /> :  <Image alt='part' source={{ uri: part.imageIds[0] }} style={styles.image} />}
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.name}>{part.name}</Text>
            </View>
            <View style={styles.infoBody}>
              <Text style={styles.text}>{`${part.completionTime} hours`}</Text>
              <Text style={styles.text}>{address?.description}</Text>
              <Text style={styles.text}>{`${job.price} MAD`}</Text>
            </View>
          </View>
          <View style={styles.materialContainer}>
            {materials.map((material) => (
              <View key={material}>
                <Text style={styles.text}>{material}</Text>
              </View>
            ))}
          </View>
          <Button onPress={acceptJob} style={styles.button}>
            Accept Job
          </Button>
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
  container: {
    flex: 1,
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
    height: 200,
    marginBottom: 20,
  },
  name: {
    fontSize: 30,
    lineHeight: 28,
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
