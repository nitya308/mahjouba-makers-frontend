import React, { useEffect } from 'react';
import { View, Text, Center } from 'native-base';
import { JobsPage } from 'screens';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { jobsSelector, pullJobs } from 'redux/slices/jobsSlice';
import { authSelector } from 'redux/slices/authSlice';

export default function JobsController(): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { jobs } = useAppSelector(jobsSelector);
  
  useEffect(() => {
    if (fbUserRef && jobs.length === 0) {
      dispatch(pullJobs({ fbUserRef }));
    }
  }, [fbUserRef]);

  return <View flex={1}>
    <JobsPage />
  </View>;
}
