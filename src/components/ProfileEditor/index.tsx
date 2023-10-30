import ProfileImageSelector from 'components/ProfileImageSelector';
import { Box, Button, Center, HStack, Heading, Icon, IconButton, Spacer, Input } from 'native-base';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Image } from 'react-native-image-crop-picker';
import { Ionicons } from '@expo/vector-icons';
import { uploadMedia } from 'utils/mediaUtils';
import useAppSelector from 'hooks/useAppSelector';
import { setProfileUri, updateUser, userDataSelector } from 'redux/slices/userDataSlice';
import Photo from 'types/photo';
import photosApi from 'requests/photosApi';
import { authSelector } from 'redux/slices/authSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import Address from '../../types/address';
import AddressInput from 'components/AddressInput';
import addressApi from 'requests/addressApi';
import { cleanUndefinedFields } from 'utils/requestUtils';

export default function ProfileEditor({
  toggleEditing,
}: {
  toggleEditing: () => void;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();
  const [currAddressString, setCurrAddressString] = useState<string | undefined>();
  const [newName, setNewName] = useState<string | undefined>();
  const [newAddress, setNewAddress] = useState<Address | undefined>();

  useEffect(() => {
    if (currAddressString) return;
    const pullAddress = async () => {
      if (!fbUserRef || !userData?.shippingAddressId) return;
      const address = await addressApi.getAddress(userData.shippingAddressId, fbUserRef);
      setCurrAddressString(address.description);
    };
    pullAddress();
  }, [userData, fbUserRef, currAddressString]);

  const saveNewAddress = useCallback(async () => {
    if (!newAddress || !fbUserRef) return;
    try {
      console.log(newAddress);
      const uploadRes = await addressApi.createAddress(newAddress, fbUserRef);
      return uploadRes._id;
    } catch (err) {
      console.log(err);
    }
  }, [newAddress, fbUserRef]);

  const saveNewProfilePic = useCallback(async () => {
    if (!selectedImage || !fbUserRef || !userData) return;
    try {
      const url = await uploadMedia(`${userData?.authId}-${(new Date()).toLocaleString()}-profile.jpeg`, selectedImage?.sourceURL || `file://${selectedImage.path}`);
      if (!url) throw new Error('Image upload failed');
      const newPhoto: Photo = {
        fullUrl: url,
        fileType: 'image/jpeg',
      };
      const dbPhoto = await photosApi.createPhoto(newPhoto, fbUserRef);
      dispatch(setProfileUri(url));
      return dbPhoto._id;
    } catch (err) {
      console.log(err);
    }
  }, [userData, fbUserRef, selectedImage]);

  const saveChanges = useCallback(async () => {
    if (!(selectedImage || newName || newAddress) || !fbUserRef || !userData) return;
    try {
      let newProfilePicId: string | undefined = undefined;
      let newAddressId: string | undefined = undefined;
      if (newAddress) {
        newAddressId = await saveNewAddress();
      }
      if (selectedImage) {
        newProfilePicId = await saveNewProfilePic();
      }

      if (newProfilePicId || newAddressId || newName) {
        dispatch(updateUser({
          updates: cleanUndefinedFields({
            profilePicId: newProfilePicId,
            shippingAddressId: newAddressId,
            name: newName,
          }),
          fbUserRef,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }, [selectedImage, saveNewAddress, saveNewProfilePic, selectedImage, newName, newAddress, fbUserRef, userData]);

  const hasChanges = useMemo(() => {
    if (selectedImage !== undefined || newName !== undefined || newAddress !== undefined) return true;
    return false;
  }, [selectedImage, newName, newAddress]);

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
      <Input
        placeholder={userData?.name || 'Name'}
        value={newName}
        onChangeText={setNewName}
        w='100%'
        mb='10px'
      />
      <AddressInput
        setAddress={setNewAddress}
        placeholder={currAddressString || 'Address'}
      />
    </Center>
    {
      hasChanges &&
      <Button onPress={saveChanges}>Save</Button>
    }
  </Box>;
}
