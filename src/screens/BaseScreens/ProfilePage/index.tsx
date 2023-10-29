import useAppSelector from 'hooks/useAppSelector';
import React from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { Button, Text, Center, Heading, HStack, IconButton, Icon, Spacer } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import ProfileEditor from 'components/ProfileEditor';
import ProfileDisplay from 'components/ProfileDisplay';

export default function ProfilePage({
  editing,
  toggleEditing,
  toggleSettingsOpen,
}: {
  editing: boolean;
  toggleEditing: () => void;
  toggleSettingsOpen: () => void;
}) {
  return <Center h='100%' px='10px'>
    { editing ?
      <ProfileEditor toggleEditing={toggleEditing} /> :
      <ProfileDisplay 
        toggleEditing={toggleEditing}
        toggleSettingsOpen={toggleSettingsOpen}
      />
    }
  </Center>;
}