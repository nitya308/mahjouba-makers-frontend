import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Center } from 'native-base';
import { JobsPage } from 'screens';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { jobsSelector, pullJobs, pullNextJobsPage } from 'redux/slices/jobsSlice';
import { authSelector } from 'redux/slices/authSlice';
import SortOptions from 'types/sortOptions';

export default function JobsController(): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { cursor } = useAppSelector(jobsSelector);
  
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState(1);

  const pullNextPage = useCallback(() => {
    if (!cursor || !fbUserRef) return;
    dispatch(pullNextJobsPage({ fbUserRef }));
  }, [fbUserRef, cursor]);
  
  useEffect(() => {
    if (fbUserRef) {
      let sortOptions: SortOptions | undefined = undefined;
      if (sortOrder && sortField) {
        sortOptions = {
          fieldName: sortField,
          order: sortOrder,
        };
      }
      dispatch(pullJobs({ fbUserRef, sortOptions }));
    }
  }, [fbUserRef, sortField, sortOrder]);

  return <View flex={1}>
    <JobsPage 
      pullNextPage={pullNextPage}
      setSortField={setSortField} 
      setSortOrder={setSortOrder} />
  </View>;
}
