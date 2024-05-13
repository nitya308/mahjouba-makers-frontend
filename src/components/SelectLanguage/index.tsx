import React, { useEffect, useState } from 'react';
import i18next from 'i18next';
import { StyleSheet } from 'react-native';
import { Languages } from 'types/user';
import { updateUser } from 'redux/slices/userDataSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector } from 'redux/slices/authSlice';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Dropdown } from 'react-native-element-dropdown';
import AppStyles from 'styles/commonstyles';
import { fonts } from 'utils/constants';
import Colors from 'utils/Colors';

export const languageMap = {
  'en': { label: 'English', active: true, value: 'en' },
  'fr': { label: 'French', active: false, value: 'fr' },
  'ar': { label: 'Arabic', active: false, value: 'ar' },
};

const SelectLanguage = () => {

  const dispatch = useAppDispatch();
  const currentLanguage = i18next.language;
  const [language, setLanguage] = useState<any>(currentLanguage);
  console.log('LAJF', language);
  const { fbUserRef } = useAppSelector(authSelector);

  const data = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'Arabic', value: 'ar' },
  ];

  useEffect(() => {
    setLanguage(i18next.language);
  }, []);


  const updateLang = (lang: any) => {
    if (!fbUserRef) return;
    try {
      dispatch(updateUser({
        updates: {
          language: lang as Languages,
        },
        fbUserRef,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dropdown
      data={data}
      placeholder={languageMap[currentLanguage as keyof typeof languageMap].label}
      style={AppStyles.profileEditingStyle}
      itemTextStyle={styles.dropdownText}
      selectedTextStyle={styles.dropdownText}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={language}
      onChange={item => {
        setLanguage(item.value);
        updateLang(item.value);
      }}
    />
  );
};

export default SelectLanguage;

const styles = StyleSheet.create({
  dropdownText: {
    color: Colors.blueBlack,
    fontFamily: fonts.regular,
    fontSize: 18,
  },
});