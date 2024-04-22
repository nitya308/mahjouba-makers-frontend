import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import React, { useCallback, useEffect, useState } from 'react';
import { getWorkshops } from 'redux/slices/workshopsSlice';
import { BulletinPage } from 'screens';
import { authSelector } from 'redux/slices/authSlice';

export default function BulletinController(): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const [refreshing, setRefreshing] = useState(false);

  const reloadWorkshops = useCallback(async () => {
    if (!fbUserRef) return;
    setRefreshing(true);
    await dispatch(getWorkshops({ fbUserRef }));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [fbUserRef, dispatch]);

  useEffect(() => {
    reloadWorkshops();
  }, [fbUserRef, reloadWorkshops]);

  return <BulletinPage reloadWorkshops={reloadWorkshops} refreshing={refreshing} />;
}
