import React, { } from 'react';
import { View, VStack } from 'native-base';
import { StyleSheet } from 'react-native';
import HammerIcon from '../../assets/hammer2.svg';
import { useTranslation } from 'react-i18next';
import TextHighlighter from 'components/SpeechHighlighter';
import AppStyles from 'styles/commonstyles';
import { Workshop } from 'types/workshop';
import SharpButton from '../SharpButton';


const WorkshopCard = ({
  workshop,
  pressed,
  setPressed,
  setSelectedWorkshopId,
}: {
  workshop: Workshop;
  pressed: boolean;
  setPressed: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedWorkshopId: (id: string) => void;
}) => {
  const { t } = useTranslation();

  const formatDate = (date: string): string => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    };
    return d.toLocaleString('en-US', options);
  };

  const handleSelect = (selectedWorkshop: Workshop) => {
    setSelectedWorkshopId(selectedWorkshop._id);
  };

  return (
    <View style={styles.workshopContainer}>
      <View style={AppStyles.row}>
        <HammerIcon />
        <VStack space={1}>
          <TextHighlighter style={styles.workshopText}
            text={t(workshop.name)}
            pressed={pressed} setPressed={setPressed} />
          <TextHighlighter style={styles.workshopText}
            text={formatDate(workshop.workshopTime.toString())}
            pressed={pressed} setPressed={setPressed} />
        </VStack>
        <SharpButton my='10px'
          size='sm' onPress={() => handleSelect(workshop)}>
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