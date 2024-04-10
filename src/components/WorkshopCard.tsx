import React, {  } from 'react';
import { View, VStack } from 'native-base';
import { StyleSheet } from 'react-native';
import HammerIcon from '../assets/hammer2.svg';
import { useTranslation } from 'react-i18next';
import TextHighlighter from 'components/SpeechHighlighter';
import AppStyles from 'styles/commonstyles';
import { Workshop } from 'types/workshop';
import JobCard from './JobCard';
import SharpButton from './SharpButton';


const WorkshopCard = ({ pressed, setPressed }: { pressed: boolean, setPressed: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const { t } = useTranslation();

  return (
    <View style={styles.workshopContainer}>
      <View style={AppStyles.row}>
        <HammerIcon />
        <VStack space={1}>
          <TextHighlighter style={styles.workshopText}
            text={t('Woodworking Workshop')}
            pressed={pressed} setPressed={setPressed} />
          <TextHighlighter style={styles.workshopText}
            text={t('2024/03/01')}
            pressed={pressed} setPressed={setPressed} />
        </VStack>
        <SharpButton my='10px'
          size='sm' onPress={() => console.log('pressed')}>
          <TextHighlighter style={AppStyles.buttonText} text={t('View')} pressed={pressed} setPressed={setPressed} />
        </SharpButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  workshopContainer: {
    backgroundColor: '#F2F1EC',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#3A3449',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
  },
  workshopText: {
    fontSize: 18,
  },
});

export default WorkshopCard;