import useAppSelector from 'hooks/useAppSelector';
import React from 'react';
import { userDataSelector } from 'redux/slices/userDataSlice';
import { Button, Text, Center, Heading, HStack, IconButton, Icon, Spacer, View } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import ProfileEditor from 'components/ProfileEditor';
import ProfileDisplay from 'components/ProfileDisplay';

export default function ProfilePage({
  editing,
  toggleEditing,
}: {
  editing: boolean;
  toggleEditing: () => void;
}) {
  return (
    editing ?
      <ProfileEditor toggleEditing={toggleEditing} /> :
      <ProfileDisplay
        toggleEditing={toggleEditing}
      />

  );
}