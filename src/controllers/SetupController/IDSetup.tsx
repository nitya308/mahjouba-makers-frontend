import SharpButton from 'components/SharpButton';
import { Center, Heading, Input, VStack, HStack, Box, Text, Icon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

export default function IDSetup({
  idNo,
  setIdNo,
}: {
  idNo?: string,
  setIdNo: (newVal?: string) => void;
}): JSX.Element {
  return <Center>
    <VStack space={2}>
      <Heading fontSize='lg'>
        ID Number
      </Heading>
      <Input
        w='100%' 
        borderRadius='2px'  
        paddingY='10px' 
        paddingX='16px'
        placeholder='Email' 
        autoCapitalize='none'
        borderColor='black'
        borderWidth='1px'
        size='sm'
        value={idNo} 
        onChangeText={setIdNo} 
      />
      <Center my='20px'>
        <HStack space='6'>
          <Box>
            <Text my='5px'>Front:</Text>
            <SharpButton leftIcon={<Icon as={MaterialCommunityIcons} name='camera-outline' size='xl' color='black' />} bgColor='white' py='20px' px='30px'></SharpButton>
          </Box>
          <Box>
            <Text my='5px'>Back:</Text>
            <SharpButton leftIcon={<Icon as={MaterialCommunityIcons} name='camera-outline' size='xl' color='black'  />} bgColor='white' py='20px' px='30px'></SharpButton>
          </Box>
        </HStack>
      </Center>
    </VStack>
  </Center>;
}
