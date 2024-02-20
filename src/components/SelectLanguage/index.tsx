import React, { useEffect, useState } from 'react';
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
  const [language, setLanguage] = useState(i18next.language);
  const { fbUserRef } = useAppSelector(authSelector);


  // useEffect(() => {
  //   // update selected location for component usage
  //   console.log(language);
  // }, []);

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
          if (language === Languages.EN) {
            setLanguage(Languages.FR);
            i18next.changeLanguage(Languages.FR);
            updateLang(Languages.FR);
          } else if (language === Languages.FR) {
            setLanguage(Languages.AR);
            i18next.changeLanguage(Languages.AR);
            updateLang(Languages.AR);
          } else {
            setLanguage(Languages.EN);
            i18next.changeLanguage(Languages.EN);
            updateLang(Languages.EN);
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