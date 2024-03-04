import React, { useState, useCallback } from 'react';
import AddressInput from 'components/AddressInput';
import Address from 'types/address';
import { View, Box, HStack, Heading, Icon, Text, Center, Spinner } from 'native-base';
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


export default function AddressSetup({ navigation, route }): JSX.Element {
  const dispatch = useAppDispatch();
  const { fbUserRef } = useAppSelector(authSelector);
  const { loading } = useAppSelector(userDataSelector);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { t } = useTranslation();

  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const { name, selectedProfileImage, idNo, idPicBack, idPicFront, iceNo, icePicBack, icePicFront, selectedMaterialIds } = route.params;

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
        <View style={{ flex: 1 }} alignItems='center'>
          <Box w='100%' alignItems='center' justifyContent='center' mt={150}>
            <Heading fontSize='30' color='white' textAlign='center'>
              {t('Where do you \n work?')}
            </Heading>
            <Box w={200} mt={70} borderColor={Colors.outline} borderRadius='5px' borderWidth={selectedAddress ? '2px' : '0px'}>
              <AddressInput
                setAddress={setSelectedAddress}
                placeholder={selectedAddress?.description || 'Address'}
              />
            </Box>
          </Box>
          <SharpButton
            backgroundColor={Colors.highlight}
            mt='20px'
            w='200px'
            onPress={() => selectedAddress ? handleSubmit() : alert('Please complete all fields')}
          >
            <Text fontSize='20' color='white' textAlign='center'>
              {t('Create Account')}
            </Text>
          </SharpButton>
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
