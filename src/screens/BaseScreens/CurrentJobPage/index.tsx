import React, { useEffect, useState } from 'react';
import { Box, Center, Text, Heading, Spinner } from 'native-base';
import useAppSelector from 'hooks/useAppSelector';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { Job } from 'types/job';
import { jobsApi } from 'requests';
import { authSelector } from 'redux/slices/authSlice';

export default function CurrentJobPage(): JSX.Element {
  const { userData } = useAppSelector(userDataSelector);
  const { fbUserRef } = useAppSelector(authSelector);

  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [jobLoading, setJobLoading] = useState(false);

  useEffect(() => {
    const pullJobForUser = async () => {
      if (!userData?.currentJobId || !fbUserRef) return;
      setJobLoading(true);
      try {
        const pulledJob = await jobsApi.getJob(userData.currentJobId, fbUserRef);
        setCurrentJob(pulledJob);
        setJobLoading(false);
      } catch (err) {
        setJobLoading(false);
        console.log(err);
      }
    };
    pullJobForUser();
  }, [userData]);

  return <Center flex='1'>
    <Heading mr='auto'>Current Job</Heading>
    {
      !jobLoading ? 
        <Text>
          { currentJob ? JSON.stringify(currentJob) : 'No current job selected' }
        </Text> :
        <Spinner />
    }
  </Center>;
}