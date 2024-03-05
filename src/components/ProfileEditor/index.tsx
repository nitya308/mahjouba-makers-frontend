import ProfileImageSelector from 'components/ProfileImageSelector';
import {
  Box,
  Center,
  HStack,
  Heading,
  Icon,
  IconButton,
  Spacer,
  Input,
  View,
  Text,
} from 'native-base';
import React, { useState, useCallback, useMemo, useEffect, useTransition } from 'react';
import { Image } from 'react-native-image-crop-picker';
import { Ionicons } from '@expo/vector-icons';
import { uploadMedia } from 'utils/mediaUtils';
import useAppSelector from 'hooks/useAppSelector';
import { updateUser, userDataSelector } from 'redux/slices/userDataSlice';
import Photo from 'types/photo';
import { authSelector } from 'redux/slices/authSlice';
import { jobsSelector, getUserJobHistory } from 'redux/slices/jobsSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import Address from '../../types/address';
import AddressInput from 'components/AddressInput';
import { cleanUndefinedFields } from 'utils/requestUtils';
import MaterialSelector from 'components/MaterialSelector';
import SharpButton from 'components/SharpButton';
import MaterialChip from 'components/MaterialChip';
import AppModal from 'components/AddModal';
import BackArrowIcon from '../../assets/back_arrow.svg';
import Colors from 'utils/Colors';
import AddIcon from '../../assets/add_icon.svg';
import { fonts } from 'utils/constants';
import { useTranslation } from 'react-i18next';
import SelectLanguage from 'components/SelectLanguage';
import { createAddress } from 'redux/slices/addressSlice';
import { createPhoto } from 'redux/slices/photosSlice';
import { DEFAULT_PROFILE_URI } from 'utils/constants';
import AppStyles from 'styles/commonstyles';
import AudioIcon from '../../assets/audio_icon.svg';
import { SafeAreaView, ScrollView } from 'react-native';

export default function ProfileEditor({
  toggleEditing,
}: {
  toggleEditing: () => void;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();
  const [newName, setNewName] = useState<string | undefined>();
  const [newAddress, setNewAddress] = useState<Address | undefined>();
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const { cursor, jobsMap, partsMap, materialsMap } = useAppSelector(jobsSelector);
  const addressMap = useAppSelector((state) => state.addresses.addressMap);
  const photoMap = useAppSelector((state) => state.photos.photosMap);

  useEffect(() => {
    if (userData?.materialIds) {
      setSelectedMaterialIds(userData?.materialIds);
      setNewName(userData?.name);
      setNewAddress(addressMap?.[userData?.homeAddressId ?? ''] ?? undefined);
      // setSelectedImage(photoMap?.[userData?.profilePicId ?? '']?.fullUrl ?? D)
    }
  }, [userData]);

  const saveNewAddress = useCallback(async () => {
    if (!newAddress || !fbUserRef) return;
    try {
      return await dispatch(createAddress({ fbUserRef, newAddress }))
        .unwrap()
        .then((res) => {
          return res?._id;
        });
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
      return await dispatch(createPhoto({ fbUserRef, newPhoto }))
        .unwrap()
        .then((res) => {
          return res?._id;
        });
    } catch (err) {
      console.log(err);
    }
  }, [userData, fbUserRef, selectedImage]);

  const saveChanges = useCallback(async () => {
    if (!(selectedImage || newName || newAddress || selectedMaterialIds) || !fbUserRef || !userData) return;
    try {
      let newProfilePicId: string | undefined = undefined;
      let newAddressId: string | undefined = undefined;
      if (newAddress) {
        newAddressId = await saveNewAddress();
      }
      if (selectedImage) {
        newProfilePicId = await saveNewProfilePic();
      }

      dispatch(updateUser({
        updates: cleanUndefinedFields({
          profilePicId: newProfilePicId,
          homeAddressId: newAddressId,
          shippingAddressId: newAddressId,
          name: newName,
          materialIds: selectedMaterialIds,
        }),
        fbUserRef,
      }));
    } catch (err) {
      console.log(err);
    }
  }, [selectedImage, saveNewAddress, saveNewProfilePic, selectedImage, newName, newAddress, fbUserRef, userData, selectedMaterialIds]);

  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();

  const [pressed, setPressed] = useState(false);

  return (
    <SafeAreaView>
      <ScrollView>
        <Box pt='75px' width={'100%'}>
          <IconButton
            style={AppStyles.audioStyle}
            icon={<AudioIcon />}
            onPress={() => {
              setPressed(true);
            }}
          />
          <HStack alignItems={'center'} justifyContent={'center'} width={'100%'}>
            <IconButton
              icon={<BackArrowIcon />}
              onPress={toggleEditing}
              position={'absolute'}
              left={0}
            />
            <Heading marginLeft={'20px'} marginRight={'10px'} fontFamily={fonts.bold}>
              Edit Profile
            </Heading>
          </HStack>
          <Center
            marginTop={'10px'}
          >
            <ProfileImageSelector
              selectedProfile={selectedImage}
              setSelectedProfile={setSelectedImage}
              defaultImageUri={photoMap?.[userData?.profilePicId ?? '']?.fullUrl ?? DEFAULT_PROFILE_URI}
              width={120}
              height={120}
            />
            <Input
              placeholder={userData?.name || 'Name'}
              value={newName}
              onChangeText={setNewName}
              w='60%'
              borderRadius='2px'
              paddingY='10px'
              paddingX='16px'
              borderColor='black'
              borderWidth='1px'
              autoCapitalize='none'
              size='sm'
              type='text'
              backgroundColor='#ffffff'
            />
            <AddressInput
              setAddress={setNewAddress}
              // TODO: Make this defaultValue instead of placeholder (so that the text isn't light grey)
              placeholder={addressMap?.[userData?.homeAddressId ?? '']?.description ?? 'Address'}
            />
            {
              // TODO: Need to figure out why can't put MaterialSelector in AppModal - Eric
            }
            {/* <HStack
          alignItems={'center'}
        >
          {
            userData?.materialIds?.map((materialId: string) => {
              const material = materialsMap[materialId];
              if (material) {
                return <MaterialChip materialName={material?.name} />;
              }
              return <></>;
            })
          }
          <AppModal 
            showModal={showModal}
            setShowModal={setShowModal}
            modalButton={
              <IconButton
                icon={<AddIcon />}
                onPress={() => {
                  setShowModal(true);
                }}
              />
            }
          >
            {/* TODO: Put MaterialSelector here */}
            {/* </AppModal> */}
            {/* </HStack> */}
            <MaterialSelector
              selectedMaterialIds={selectedMaterialIds}
              setSelectedMaterialIds={setSelectedMaterialIds}
            />
          </Center>
          <Center>
            <SharpButton
              width={'80px'}
              backgroundColor={Colors.yellow}
              my='2px'
              size='sm'
              onPress={saveChanges}
              marginTop={'10px'}
            >
              <Text fontFamily={fonts.regular}>
                Save
              </Text>
            </SharpButton>
          </Center>
          {
            // demo translation functionality
          }
          <Center>
            <Text>
              {
                'demo translation functionality: '
              }
              {
                t('Hello world')
              }
            </Text>
            <SelectLanguage />
          </Center>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
