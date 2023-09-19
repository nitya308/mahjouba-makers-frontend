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

import Rings from '../../assets/rings.svg';
import { fonts } from 'utils/constants';
import Colors from 'utils/Colors';
import TextStyles from 'utils/TextStyles';
import { Ionicons } from '@expo/vector-icons';
import useAppDispatch from 'hooks/useAppDispatch';
import { logout } from 'redux/slices/authSlice';

const BaseView = ({ 
  children, 
  showRings, 
  smallLogo, 
  noLogo,
  logoText,
  elongatedLogo,
  style,
  showTopRightIcon,
}: { children: React.ReactNode, showRings?: boolean, smallLogo?: boolean, noLogo?: boolean, elongatedLogo?: boolean, logoText?: string, style?: StyleProp<ViewStyle>, showTopRightIcon?: boolean }) => {
  const isLoading = useIsLoading();

  const dispatch = useAppDispatch();
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclose();

  return (
    <View style={[FormatStyle.container, style]}>
      <LinearGradient colors={['#3D037A', '#1A2655', '#4D1F63', '#380B52']} style={styles.imageBackground}>
        {showTopRightIcon && (
          <Pressable style={{ position: 'absolute', top: 60, right: 20, zIndex: 200 }} onPress={onOpen}>
            <Ionicons name="ellipsis-vertical-outline" size={20} color="white" />
          </Pressable>
        )}
        <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.imageBackground}>
          <View style={styles.logo}>
            {!!logoText && (
              <VStack>
                <Text 
                  color="white" 
                  fontFamily={fonts.medium}
                  fontSize={18}
                  textAlign="center"
                  mb={-6}
                  zIndex={100}
                >
                  {logoText}
                </Text>
                {elongatedLogo ? <LogoElongatedNoText /> : <LogoSmallNoText />}
              </VStack>
            )}
            {!logoText && (
              noLogo 
                ? null 
                : (smallLogo ? <LogoSmallNoText style={{ width: 99, height: 46 }} /> : <LogoElongatedNoText style={{ width: 165, height: 89 }} />)
            )
            }
          </View>

          {showRings && 
          (<View style={styles.rings}>
            <Rings style={{ width: 681, height: 474 }} />
          </View>)}

          {children}
        </ImageBackground>
      </LinearGradient>
      <Overlay
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
      </Overlay>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={() => dispatch(logout({}))}>
            <Text style={{ color: Colors.primary, fontFamily: fonts.semiBold, fontSize: 16 }}>Log out</Text>
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
