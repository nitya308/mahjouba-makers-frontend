import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Center } from 'native-base';
import { ProfilePage, AccountSettingsPage } from 'screens/BaseScreens';
import useAppDispatch from 'hooks/useAppDispatch';
import { pullUserProfileImg, userDataSelector } from 'redux/slices/userDataSlice';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector } from 'redux/slices/authSlice';
import Colors from 'utils/Colors';

export default function ProfileController(): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData, profileImageUri } = useAppSelector(userDataSelector);
  const [profileEditing, setProfileEditing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleProfileEditing = useCallback(() => {
    setProfileEditing(!profileEditing);
  }, [profileEditing, setProfileEditing]);

  const toggleSettingsOpen = useCallback(() => {
    if (!settingsOpen) {
      setProfileEditing(false);
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
    }
  }, [settingsOpen, setSettingsOpen, profileEditing]);

  useEffect(() => {
    if (fbUserRef && userData?.profilePicId && !profileImageUri) {
      dispatch(pullUserProfileImg({ fbUserRef }));
    }
  }, [userData, fbUserRef, profileImageUri]);

  return <View flex={1} backgroundColor={Colors.backgroundWhite}>
    {
      settingsOpen ? 
        <AccountSettingsPage exit={() => toggleSettingsOpen()} /> :
        <ProfilePage
          editing={profileEditing}
          toggleEditing={toggleProfileEditing}
          toggleSettingsOpen={toggleSettingsOpen} />
    }
  </View>;
}
