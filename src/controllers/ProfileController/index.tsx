
import React, { useCallback, useState } from 'react';
import { ProfilePage } from 'screens/BaseScreens';


export default function ProfileController(): JSX.Element {
  const [profileEditing, setProfileEditing] = useState(false);

  const toggleProfileEditing = useCallback(() => {
    setProfileEditing(!profileEditing);
    console.log('Profile editing toggled');
  }, [profileEditing, setProfileEditing]);

  return (
    <ProfilePage
      editing={profileEditing}
      toggleEditing={toggleProfileEditing}
    />
  );
}
