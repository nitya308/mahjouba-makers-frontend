import React, { useState, useEffect } from 'react';
import i18next from 'i18next';
import { Button } from 'react-native';

export const languageMap = {
  EN: { label: 'English', active: true, abb: 'EN' },
  FR: { label: 'French', active: false, abb: 'FR' },
};

const SelectLanguage = () => {
  const [language, setLanguage] = useState('en');

  return (
    <Button
      onPress={() => {
        if (language === 'EN') {
          setLanguage('FR');
          i18next.changeLanguage('fr');
        } else {
          setLanguage('EN');
          i18next.changeLanguage('en');
        }
      }}
      title="Change Language"
    />
  );
};

export default SelectLanguage;