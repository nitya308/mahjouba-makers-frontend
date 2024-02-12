import React, { useState, useEffect } from 'react';
import i18next from 'i18next';
import { Button } from 'react-native';

export const languageMap = {
  EN: { label: 'English', active: true, abb: 'EN' },
  FR: { label: 'French', active: false, abb: 'FR' },
  AR: { label: 'Arabic', active: false, abb: 'AR' },
};

const SelectLanguage = () => {
  const [language, setLanguage] = useState('EN');

  return (
    <Button
      onPress={() => {
        try {
          if (language === 'EN') {
            setLanguage('FR');
            i18next.changeLanguage('fr');
          } else if (language === 'FR') {
            setLanguage('AR');
            i18next.changeLanguage('ar');
          } else {
            setLanguage('EN');
            i18next.changeLanguage('en');
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