import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Button, Center, Spinner } from 'native-base';
import { StyleSheet } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { authSelector } from 'redux/slices/authSlice';
import { jobsSelector } from 'redux/slices/jobsSlice';
import { getUser, userDataSelector } from 'redux/slices/userDataSlice';
import { jobsApi, usersApi } from 'requests';
import partsApi from 'requests/partsApi';
import { Job } from 'types/job';
import { PartType } from 'types/part_type';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [part, setPart] = useState<PartType | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) return;
    const pullJob = async () => {
      if (!fbUserRef) return;
      try {
        setLoading(true);
        const dbJob = await jobsApi.getJob(jobId, fbUserRef);
        if (dbJob) {
          setJob(dbJob);
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
    if (!job || !(job.customPartId in partsMap)) return;
    setPart(partsMap[job.customPartId]);
  }, [job, partsMap]);

  const acceptJob = useCallback(async () => {
    if (!fbUserRef || !userData?._id) return;
    try {
      await usersApi.updateUserCurrJob(jobId, fbUserRef);
      dispatch(getUser({ fbUserRef }));
    } catch (err) {
      console.log(err);
    }
  }, [jobId, fbUserRef]);

  // need to get address from api using job.dropoffAddressId
  return (
    <SafeAreaView style={styles.container}>
      {loading && <Spinner />}
      {part && job ? (
        <>
          <Image source={{ uri: part.imageIds[0] }} alt="image of part" style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{part.name}</Text>
            <Text style={styles.text}>{`${part.completionTime} hours`}</Text>
            <Text style={styles.text}>{`${job.price} MAD`}</Text>
          </View>
          <Button onPress={acceptJob} style={styles.button}>
            Accept Job
          </Button>
        </>
      ) : (
        <Text style={styles.text}>No part found with id{job?.customPartId}</Text>
      )}
      <Button onPress={exit} style={styles.button}>
        Exit
      </Button>
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
