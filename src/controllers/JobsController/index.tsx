import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Center } from 'native-base';
import { JobsPage } from 'screens';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { clearJobFeed, getPartsAndMaterialsForJob, getAllMaterials, getUserCurrentJob, getUserJobHistory, jobsSelector, pullJobs, pullNextJobsPage } from 'redux/slices/jobsSlice';
import { authSelector } from 'redux/slices/authSlice';
import SortOptions from 'types/sortOptions';
import { Job } from 'types/job';
import JobDetailsPage from 'screens/BaseScreens/JobDetailsPage';
import CurrentJobPage from 'screens/BaseScreens/CurrentJobPage';

export default function JobsController(): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { cursor, currentJobId } = useAppSelector(jobsSelector);

  const [sortField, setSortField] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState(1);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  const pullNextPage = useCallback(() => {
    if (!cursor || !fbUserRef) return;
    dispatch(pullNextJobsPage({ fbUserRef }));
  }, [fbUserRef, cursor]);

  const reloadJobs = useCallback(async () => {
    if (!fbUserRef) return;
    setRefreshing(true);
    let sortOptions: SortOptions | undefined = undefined;
    if (sortOrder && sortField) {
      sortOptions = {
        fieldName: sortField,
        order: sortOrder,
      };
    }
    await dispatch(clearJobFeed());
    await dispatch(pullJobs({ fbUserRef, sortOptions }));
    await dispatch(getAllMaterials({ fbUserRef }));
    await dispatch(getUserJobHistory({ fbUserRef }));
    await dispatch(getUserCurrentJob({ fbUserRef }));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [fbUserRef, sortField, sortOrder]);

  useEffect(() => {
    reloadJobs();
    // put materials loading here

  }, [fbUserRef, sortField, sortOrder, reloadJobs]);


  return <View flex={1}>
    {currentJobId ?
      <CurrentJobPage setDetailsPageOpen={setDetailsPageOpen}></CurrentJobPage> :
      <JobsPage
        pullNextPage={pullNextPage}
        reloadJobs={reloadJobs} 
        refreshing={refreshing}/>
    }
  </View>;
}
