import React from 'react';
import { Box, Text } from 'native-base';
import MaterialSelector from 'components/MaterialSelector';

export default function MaterialSetup({
  selectedMaterialIds,
  setSelectedMaterialIds,
}: {
  selectedMaterialIds: string[];
  setSelectedMaterialIds: (newIds: string[]) => void;
}): JSX.Element {
  return <Box minH='200px'>
    <Text fontSize='md'>
      What materials do you work with
    </Text>
    <MaterialSelector
      selectedMaterialIds={selectedMaterialIds}
      setSelectedMaterialIds={setSelectedMaterialIds}
    />
  </Box>;
}
