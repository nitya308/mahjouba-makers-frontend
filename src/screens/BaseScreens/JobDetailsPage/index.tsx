import useAppSelector from 'hooks/useAppSelector';
import React, { useCallback, useEffect, useState } from 'react';
import { authSelector } from 'redux/slices/authSlice';
import { jobsSelector } from 'redux/slices/jobsSlice';
import { getUser, updateUser, userDataSelector } from 'redux/slices/userDataSlice';
import { jobsApi, usersApi } from 'requests';
import partsApi from 'requests/partsApi';
import { Job } from 'types/job';
import Part from 'types/part_type';
import { Button, Center, Spinner, Text } from 'native-base';
import useAppDispatch from 'hooks/useAppDispatch';

export default function JobDetailsPage({
  jobId,
  exit,
}: {
  jobId: string,
  exit: () => void,
}): JSX.Element {
  const dispatch = useAppDispatch();

  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);
  const { partsMap } = useAppSelector(jobsSelector);
  const [job, setJob] = useState<Job | undefined>();
  const [part, setPart] = useState<Part | undefined>();
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
    if (!job || !(job.partId in partsMap)) return;
    setPart(partsMap[job.partId]);
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

  return <Center h='100%'>
    {loading && <Spinner />}
    {
      part ?
        <>
          <Text>{part.name}</Text> 
          <Text>{part.description}</Text> 
          <Button onPress={acceptJob}>
          accept job
          </Button>
        </> :
        <Text>No part found with id {job?.partId}</Text>
    }
    <Button onPress={exit}>
      exit
    </Button>
  </Center>;
}