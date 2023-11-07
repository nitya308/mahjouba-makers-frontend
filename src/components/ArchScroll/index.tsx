import React, { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, Box, View } from 'native-base';
import Colors from 'utils/Colors';

export default function ArchScroll({
  children,
}: PropsWithChildren<{
  children?: ReactNode
}>): JSX.Element {
  return <View flex='1'>
    <ScrollView w='100%' h='100%' bgColor={Colors.backgroundBase} nestedScrollEnabled={true}>
      <Box mt='20px' w='90%' mx='auto' bgColor={Colors.backgroundLight} borderColor='black' borderWidth='1px' borderTopRadius='full' minH='100%'>
        {children}
      </Box>
    </ScrollView>
  </View>;
}
