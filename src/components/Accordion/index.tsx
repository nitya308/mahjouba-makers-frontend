import React, { useState } from 'react';
import { StyleSheet, Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Colors from '../../utils/Colors';
import TextStyles from '../../utils/TextStyles';

interface AccordionProps {
  title: string
  children: React.ReactNode
}

const Accordion = ({ title, children }: AccordionProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.outer}>
      <TouchableOpacity style={styles.row} onPress={() => toggleExpand()}>
        <Text style={styles.title}>{title}</Text>
        <AntDesign name={expanded ? 'minuscircleo' : 'pluscircleo'} size={30} color='white' />
      </TouchableOpacity>
      {
        expanded &&
          <View style={styles.child}>
            {children}
          </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    ...TextStyles.subTitle,
    // fontSize: 18,
    // fontWeight:'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  outer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    width: Dimensions.get('window').width * 0.9,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: 'center',
    fontWeight: 'bold',
    backgroundColor: Colors.primary,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  parentHr: {
    height: 1,
    color: 'white',
    width: '100%',
  },
  child: {
    padding: 16,
  },
});

export default Accordion;
