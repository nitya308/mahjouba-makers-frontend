import ProfileImageSelector from 'components/ProfileImageSelector';
import { Box, Button, Center, HStack, Heading, Icon, IconButton, Spacer } from 'native-base';
import React, { useState, useCallback, useMemo } from 'react';
import { Image } from 'react-native-image-crop-picker';
import { Ionicons } from '@expo/vector-icons';
import { uploadMedia } from 'utils/mediaUtils';
import useAppSelector from 'hooks/useAppSelector';
import { setProfileUri, updateUser, userDataSelector } from 'redux/slices/userDataSlice';
import Photo from 'types/photo';
import photosApi from 'requests/photosApi';
import { authSelector } from 'redux/slices/authSlice';
import useAppDispatch from 'hooks/useAppDispatch';

export default function ProfileEditor({
  toggleEditing,
}: {
  toggleEditing: () => void;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();

  const saveChanges = useCallback(async () => {
    if (!selectedImage || !fbUserRef || !userData) return;
    try {
      const url = await uploadMedia(`${userData?.authId}-${(new Date()).toLocaleString()}-profile.jpeg`, selectedImage?.sourceURL || `file://${selectedImage.path}`);
      if (!url) throw new Error('Image upload failed');
      const newPhoto: Photo = {
        fullUrl: url,
        fileType: 'image/jpeg',
      };
      const dbPhoto = await photosApi.createPhoto(newPhoto, fbUserRef);
      if (dbPhoto?._id) {
        dispatch(updateUser({
          updates: {
            profilePicId: dbPhoto._id,
          },
          fbUserRef,
        }));
        dispatch(setProfileUri(url));
      }
    } catch (err) {
      console.log(err);
    }
  }, [selectedImage]);

  const hasChanges = useMemo(() => {
    if (selectedImage !== undefined) return true;
    return false;
  }, [selectedImage]);

  return <Box w='100%'>
    <HStack>
      <IconButton
        icon={<Icon as={Ionicons} name='arrow-back' />}
        onPress={toggleEditing}
      />
      <Spacer />
      <Heading>
        Edit Profile
      </Heading>
    </HStack>
    <Center>
      <ProfileImageSelector
        selectedProfile={selectedImage}
        setSelectedProfile={setSelectedImage}
        width={120}
        height={120}
      />
    </Center>
    {
      hasChanges &&
      <Button onPress={saveChanges}>Save</Button>
    }
  </Box>;
}