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
        try {
          if (language === 'EN') {
            setLanguage('FR');
            console.log('here1');
            i18next.changeLanguage('fr');
            console.log('here2');
          } else {
            setLanguage('EN');
            i18next.changeLanguage('en');
          }
        } catch (e) {
          console.log(e);
        }
      }}
      title={`Change Language (selected = ${language})` }
    />
  );
};

export default SelectLanguage;