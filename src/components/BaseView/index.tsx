import React from 'react';
import { View, ImageBackground, StyleSheet, Dimensions, StyleProp, ViewStyle, Pressable } from 'react-native';
import { Text, useDisclose, VStack, Actionsheet } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { Overlay } from 'react-native-elements';
import useIsLoading from 'hooks/useIsLoading';
import FormatStyle from 'utils/FormatStyle';
import backgroundImage from '../../assets/background-stars-2x.png';
import LogoSmallNoText from '../../assets/logo-small-no-text.svg';
import LogoElongatedNoText from '../../assets/logo-elongated-no-text.svg';

import { fonts } from 'utils/constants';
import Colors from 'utils/Colors';
import TextStyles from 'utils/TextStyles';
import { Ionicons } from '@expo/vector-icons';
import useAppDispatch from 'hooks/useAppDispatch';
import { logout } from 'redux/slices/authSlice';
import { clearUserData } from 'redux/slices/userDataSlice';

const BaseView = ({ 
  children, 
  smallLogo, 
  noLogo,
  logoText,
  elongatedLogo,
  style,
  showTopRightIcon,
}: { 
  children: React.ReactNode, 
  smallLogo?: boolean, 
  noLogo?: boolean, 
  elongatedLogo?: boolean, 
  logoText?: string, 
  style?: StyleProp<ViewStyle>, 
  showTopRightIcon?: boolean 
}) => {
  const isLoading = useIsLoading();

  const dispatch = useAppDispatch();
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclose();

  return (
    <View style={[FormatStyle.container, style]}>
      {showTopRightIcon && (
        <Pressable style={{ position: 'absolute', top: 60, right: 20, zIndex: 200 }} onPress={onOpen}>
          <Ionicons name="ellipsis-vertical-outline" size={20} />
        </Pressable>
      )}
      <View style={styles.logo}>
        {!!logoText && (
          <VStack>
            <Text 
              fontFamily={fonts.regular}
              fontSize='18px'
              textAlign="center"
              mb='-6px'
              zIndex='100'
            >
              {logoText as string}
            </Text>
            {/* {elongatedLogo ? <LogoElongatedNoText /> : <LogoSmallNoText />} */}
          </VStack>
        )}
        {/* {!logoText && (
              noLogo 
                ? null 
                : (smallLogo ? <LogoSmallNoText style={{ width: 99, height: 46 }} /> : <LogoElongatedNoText style={{ width: 165, height: 89 }} />)
            )
            } */}
      </View>
      {children}
      {/* <Overlay
        isVisible={isLoading}
        overlayStyle={{
          backgroundColor: Colors.primary,
        }}
      >
        <Text
          style={{
            color: Colors.white,
            ...TextStyles.small,
          }}
        >
          Loading...
        </Text>
      </Overlay> */}
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={() => {
            dispatch(logout({}));
            dispatch(clearUserData());
          }}>
            <Text style={{ color: Colors.primary, fontFamily: fonts.bold, fontSize: 16 }}>Log out</Text>
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  logo: {
    position: 'absolute',
    top: 60,
  },
  rings: {
    position: 'absolute',
    bottom: Dimensions.get('screen').height * 0.2,
  },
});

export default BaseView;
