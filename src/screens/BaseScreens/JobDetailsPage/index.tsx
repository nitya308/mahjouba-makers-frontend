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
  const { partsMap } = useAppSelector(jobsSelector);
  const [job, setJob] = useState<Job | undefined>();
  const [address, setAddress] = useState<Address | undefined>();
  const [part, setPart] = useState<PartType | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) return;
    const pullJob = async () => {
      if (!fbUserRef) return;
      try {
        setLoading(true);
        const dbJob = await jobsApi.getJob(jobId, fbUserRef);
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
  }, [jobId, fbUserRef]);

  useEffect(() => {
    if (!job || !(job.partTypeId in partsMap)) return;
    setPart(partsMap[job.partTypeId]);
  }, [job, partsMap]);

  const acceptJob = useCallback(async () => {
    if (!fbUserRef) return;
    try {
      dispatch(updateUser({
        updates: {
          currentJobId: jobId,
        },
        fbUserRef,
      }));
    } catch (err) {
      console.log(err);
    }
  }, [jobId, fbUserRef]);

  console.log(job, part, address);

  // need to get address from api using job.dropoffAddressId
  return (
    <SafeAreaView style={styles.container}>
      {loading && <Spinner />}
      {part && job ? (
        <>
          <TouchableOpacity onPress={exit}>
            <XIcon width={30} height={30} />
          </TouchableOpacity>
          <Image source={{ uri: part.imageIds[0] }} alt="image of part" style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{part.name}</Text>
            <Text style={styles.text}>{`${part.completionTime} hours`}</Text>
            <Text style={styles.text}>{`${job.price} MAD`}</Text>
            <Text style={styles.text}>{address?.city}</Text>
          </View>
          <Button onPress={acceptJob} style={styles.button}>
            Accept Job
          </Button>
        </>
      ) : (
        <Text style={styles.text}>No part found with id{job?.partTypeId}</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  infoContainer: {
    width: '100%',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  name: {
    fontSize: 30,
    lineHeight: 30,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default JobDetailsPage;
