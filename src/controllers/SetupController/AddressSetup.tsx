import React, { useState, useCallback } from 'react';
import AddressInput from 'components/AddressInput';
import Address from 'types/address';
import { View, Box, HStack, Heading, Icon, Text, Center, Spinner, IconButton, VStack, Spacer } from 'native-base';
import Colors from 'utils/Colors';
import SharpButton from 'components/SharpButton';
import DotProgress from 'components/DotProgress';
import { AntDesign } from '@expo/vector-icons';
import { uploadMedia } from 'utils/mediaUtils';
import { authSelector, logout } from 'redux/slices/authSlice';
import { clearUserData, initUser, userDataSelector } from 'redux/slices/userDataSlice';
import { useTranslation } from 'react-i18next';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import TextHighlighter from 'components/SpeechHighlighter';
import styles from 'styles/onboarding';
import AudioIcon from '../../assets/audio_icon.svg';
import AppStyles from 'styles/commonstyles';

export default function AddressSetup({ navigation, route }): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { loading } = useAppSelector(userDataSelector);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { t } = useTranslation();

  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const { name, selectedProfileImage, idNo, idPicBack, idPicFront, iceNo, icePicBack, icePicFront, selectedMaterialIds } = route.params;
  const [pressed, setPressed] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!idNo || !iceNo || !selectedAddress || !idPicBack?.uri || !idPicFront?.uri || !icePicBack?.uri || !icePicFront?.uri || !fbUserRef || !name) return;
    console.log([idPicFront, idPicBack]);
    setImageUploading(true);
    try {
      const idPicFrontUploadUri = await uploadMedia(`${fbUserRef?.uid}-idFront.jpeg`, idPicFront.uri);
      const idPicBackUploadUri = await uploadMedia(`${fbUserRef?.uid}-idBack.jpeg`, idPicBack.uri);

      const icePicFrontUploadUri = await uploadMedia(`${fbUserRef?.uid}-iceFront.jpeg`, icePicFront.uri);
      const icePicBackUploadUri = await uploadMedia(`${fbUserRef?.uid}-iceBack.jpeg`, icePicBack.uri);

      setImageUploading(false);
      if (!idPicFrontUploadUri || !idPicBackUploadUri || !icePicFrontUploadUri || !icePicBackUploadUri) {
        setError('Image upload failed');
        return;
      }

      let profilePicUri: string | undefined = undefined;
      if (selectedProfileImage) {
        profilePicUri = await uploadMedia(`${fbUserRef?.uid}-profile.jpeg`, `file://${selectedProfileImage?.path}`);
      }

      dispatch(initUser({
        userData: {
          name,
          email: fbUserRef.email !== null ? fbUserRef.email : fbUserRef.phoneNumber,
          homeAddress: selectedAddress,
          shippingAddress: selectedAddress,
          profilePic: profilePicUri ? {
            fullUrl: profilePicUri,
            fileType: 'image/jpeg',
          } : undefined,
          idFront: {
            fullUrl: idPicFrontUploadUri,
            fileType: 'image/jpeg',
          },
          idBack: {
            fullUrl: idPicBackUploadUri,
            fileType: 'image/jpeg',
          },
          iceFront: {
            fullUrl: icePicFrontUploadUri,
            fileType: 'image/jpeg',
          },
          iceBack: {
            fullUrl: icePicBackUploadUri,
            fileType: 'image/jpeg',
          },
          idNo,
          iceNo,
        },
        fbUserRef,
      }));
    } catch (err) {
      console.log(err);
      setImageUploading(false);
    }
  }, [name, idNo, idPicBack, idPicFront, iceNo, icePicFront, icePicBack, selectedAddress, selectedMaterialIds, selectedProfileImage, fbUserRef, setImageUploading]);

  if (loading || imageUploading) {
    return <View flex='1'>
      <Center h='100%'>
        <Spinner />
      </Center>
    </View>;
  }

  return (
    <>
      {loading || imageUploading ? (
        <View flex='1'>
          <Center h='100%'>
            <Spinner />
          </Center>
        </View>
      ) : (
        <View style={AppStyles.mainContainer} alignItems='center'>
          <IconButton
            style={styles.audioStyle}
            icon={<AudioIcon />}
            onPress={() => {
              setPressed(true);
            }}
          />
          <VStack space={0} w='100%' alignItems='center' mt={150}>
            <TextHighlighter style={styles.heading} text={t('Where do you \n work?')} pressed={pressed} setPressed={setPressed} />
            <Spacer size={10} />
            <TextHighlighter style={styles.inputLabel} text={t('Your address')} pressed={pressed} setPressed={setPressed} />
            <AddressInput
              setAddress={setSelectedAddress}
              placeholder={selectedAddress?.description || t('Address')}
            />
            <Spacer size={20} />
            <SharpButton onPress={() => selectedAddress ? handleSubmit() : alert('Please complete all fields')}>
              <TextHighlighter style={AppStyles.buttonText} text={t('Complete Profile')} pressed={pressed} setPressed={setPressed} />
            </SharpButton>
          </VStack>


          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, marginBottom: 50 }}>
            <HStack
              space={4}
              justifyContent='space-around'
              alignItems='center'
              alignSelf='flex-end'
              width='100%'
            >
              <SharpButton
                leftIcon={<Icon as={AntDesign} name='arrowleft' color='white' size='lg' />}
                ml='30px'
                p='10px'
                onPress={navigation.goBack}
              />
              <DotProgress progress={6} completion={7} />
            </HStack>
          </View>
        </View>
      )}
    </>
  );

}
