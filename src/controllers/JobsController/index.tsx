import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Center } from 'native-base';
import { JobsPage } from 'screens';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { jobsSelector, pullJobs, pullNextJobsPage } from 'redux/slices/jobsSlice';
import { authSelector } from 'redux/slices/authSlice';
import SortOptions from 'types/sortOptions';
import { Job } from 'types/job';
import JobDetailsPage from 'screens/BaseScreens/JobDetailsPage';
import Colors from 'utils/Colors';

export default function JobsController(): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { cursor } = useAppSelector(jobsSelector);
  
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState(1);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>();

  const pullNextPage = useCallback(() => {
    if (!cursor || !fbUserRef) return;
    dispatch(pullNextJobsPage({ fbUserRef }));
  }, [fbUserRef, cursor]);

  const reloadJobs = useCallback(async () => {
    if (!fbUserRef) return;
    let sortOptions: SortOptions | undefined = undefined;
    if (sortOrder && sortField) {
      sortOptions = {
        fieldName: sortField,
        order: sortOrder,
      };
    }
    dispatch(pullJobs({ fbUserRef, sortOptions }));
  }, [fbUserRef, sortField, sortOrder]);
  
  useEffect(() => {
    reloadJobs();
  }, [fbUserRef, sortField, sortOrder, reloadJobs]);

  const handleJobSelect = useCallback((job?: Job) => {
    if (!detailsPageOpen) {
      setSelectedJob(job);
      setDetailsPageOpen(true);
    } else {
      setDetailsPageOpen(false);
      setSelectedJob(undefined);
    }
  }, [detailsPageOpen, selectedJob, setSelectedJob]);

  return <View flex={1} backgroundColor={Colors.backgroundWhite}>
    {detailsPageOpen && selectedJob ?
      <JobDetailsPage
        selectedJob={selectedJob}
        exit={handleJobSelect} /> : 
      <JobsPage 
        handleSelect={handleJobSelect}
        pullNextPage={pullNextPage}
        setSortField={setSortField} 
        setSortOrder={setSortOrder}
        reloadJobs={reloadJobs} />
    }
  </View>;
}
