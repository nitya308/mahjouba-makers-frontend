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
  VStack,
} from 'native-base';
import React, { useState, useCallback, useMemo, useEffect, useTransition } from 'react';
import { Image } from 'react-native-image-crop-picker';
import BackCircle from 'assets/back_circle.svg';
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
import StopIcon from '../../assets/hand_icon.svg';
import * as Speech from 'expo-speech';
import { Modal, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import TextHighlighter from 'components/SpeechHighlighter';
import OnboardingStyles from 'styles/onboarding';
import { background } from 'native-base/lib/typescript/theme/styled-system';
import { TextInput } from 'react-native';

export default function ProfileEditor({
  toggleEditing,
}: {
  toggleEditing: () => void;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const { fbUserRef } = useAppSelector(authSelector);
  const { userData } = useAppSelector(userDataSelector);
  const [selectedImage, setSelectedImage] = useState<Image | undefined>();
  const [newName, setNewName] = useState<string | undefined>();
  const [newAddress, setNewAddress] = useState<Address | undefined>();
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const { cursor, jobsMap, partsMap, materialsMap } = useAppSelector(jobsSelector);
  const addressMap = useAppSelector((state) => state.addresses.addressMap);
  const photoMap = useAppSelector((state) => state.photos.photosMap);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
    <SafeAreaView style={AppStyles.mainContainer}>

      <TouchableOpacity style={AppStyles.exitButton} onPress={toggleEditing}>
        <BackCircle width={40} height={40} />
      </TouchableOpacity>

      <VStack mt={5} mb={5}>
        <TextHighlighter style={AppStyles.center_heading} text={t('Edit Profile')} pressed={pressed} setPressed={setPressed} />
      </VStack>

      <ScrollView style={{ paddingHorizontal: 20 }}>
        <ProfileImageSelector
          selectedProfile={selectedImage}
          setSelectedProfile={setSelectedImage}
          defaultImageUri={photoMap?.[userData?.profilePicId ?? '']?.fullUrl ?? DEFAULT_PROFILE_URI}
          width={120}
          height={120}
        />

        <TextHighlighter style={AppStyles.bodyTextMd} text={t('Name')} pressed={pressed} setPressed={setPressed} />
        <TextInput
          style={AppStyles.profileEditingStyle}
          defaultValue={userData?.name || 'Name'}
          value={newName}
          onChangeText={setNewName}
        />

        <TextHighlighter style={AppStyles.bodyTextMd} text={t('Address')} pressed={pressed} setPressed={setPressed} />
        <AddressInput
          setAddress={setNewAddress}
          placeholder={addressMap?.[userData?.homeAddressId ?? '']?.description ?? 'Address'}
        />

        <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
          <SharpButton my='10px' size='sm' onPress={saveChanges}>
            <TextHighlighter style={AppStyles.buttonText} text={t('Save')} pressed={pressed} setPressed={setPressed} />
          </SharpButton>
        </View>

        <Spacer size={5} />

        <TextHighlighter style={AppStyles.bodyTextMd} text={t('Change App language')} pressed={pressed} setPressed={setPressed} />
        <Center>
          <Text>
            {'demo translation functionality: '}
            {t('Hello world')}
          </Text>
          <SelectLanguage />
        </Center>
      </ScrollView>
      <IconButton
        icon={!pressed ? <AudioIcon /> : <StopIcon/>}
        onPress={() => {
          if (pressed) {
            Speech.stop();
            setPressed(false);
          } else {
            setPressed(true);
          }
        }}
        style={AppStyles.audioButtonStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  plusSign: {
    fontSize: 18,
    color: '#080026',
  },
});