import React, { useState } from 'react';
import i18next from 'i18next';
import { Button } from 'react-native';
import { Languages } from 'types/user';
import { updateUser } from 'redux/slices/userDataSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector } from 'redux/slices/authSlice';

export const languageMap = {
  EN: { label: 'English', active: true, abb: 'EN' },
  FR: { label: 'French', active: false, abb: 'FR' },
  AR: { label: 'Arabic', active: false, abb: 'AR' },
};

const SelectLanguage = () => {
  const dispatch = useAppDispatch();
  const [language, setLanguage] = useState('EN');
  const { fbUserRef } = useAppSelector(authSelector);

  const updateLang = (lang: string) => {
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
    <Button
      onPress={() => {
        try {
          if (language === 'EN') {
            setLanguage('FR');
            i18next.changeLanguage('fr');
            updateLang('fr');
          } else if (language === 'FR') {
            setLanguage('AR');
            i18next.changeLanguage('ar');
            updateLang('ar');
          } else {
            setLanguage('EN');
            i18next.changeLanguage('en');
            updateLang('en');
          }
        } catch (e) {
          console.log(e);
        }
      }}
      title={`Change Language (selected = ${language})`}
    />
  );
};

export default SelectLanguage;