import React, { useState, useEffect, useCallback } from 'react';
import useAppSelector from 'hooks/useAppSelector';
import { authSelector } from 'redux/slices/authSlice';
import { IMaterial } from 'types/material';
import { Box, Checkbox, FlatList, HStack, Spacer, Text } from 'native-base';
import materialsApi from 'requests/materialsApi';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from 'utils/Colors';

export default function MaterialSelector({
  selectedMaterialIds,
  setSelectedMaterialIds,
}: {
  selectedMaterialIds: string[],
  setSelectedMaterialIds: (newMaterials: string[]) => void,
}): JSX.Element {
  const { fbUserRef } = useAppSelector(authSelector);

  const [materialList, setMaterialList] = useState<IMaterial[]>([]);

  useEffect(() => {
    if (materialList.length > 0) return;
    const fetchMaterials = async () => {
      if (!fbUserRef) return;
      try {
        const dbMaterials = await materialsApi.getMaterials(fbUserRef);
        // console.log('materials: ');
        // console.log(dbMaterials);
        if (dbMaterials && dbMaterials.length > 0) {
          setMaterialList(dbMaterials);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMaterials();
  }, [materialList, fbUserRef]);

  const onSelect = useCallback((_id: string) => {
    if (selectedMaterialIds.includes(_id)) {
      setSelectedMaterialIds(
        selectedMaterialIds.filter((mid) => mid !== _id),
      );
    } else {
      setSelectedMaterialIds([
        ...selectedMaterialIds,
        _id,
      ]);
    }
  }, [selectedMaterialIds]);

  const renderItem = useCallback(({ item, index }: { item: IMaterial, index: number }) => {
    const checked = selectedMaterialIds.includes(item._id);
    return <Box
      key={index}
      width='230'
      padding={1}
      borderColor={Colors.outline}
      borderWidth={1}
      marginBottom={3}
      backgroundColor={checked ? 'rgba(255, 192, 29, 0.2)' : 'transparent'}
    >
      <TouchableOpacity onPress={() => onSelect(item._id)} key={index} style={{
        width: '100%',
        padding: 5,
      }}>
        <HStack w='100%' flex='1' minW='150px' flexShrink={0}>
          <Checkbox value={item.name} colorScheme="orange" isChecked={checked} aria-label={item.name} />
          <Text lineHeight={22} ml='10' fontSize='18px' color='white' textTransform='capitalize'>{item.name} </Text>
        </HStack>
      </TouchableOpacity>
    </Box>;
  }, [onSelect, selectedMaterialIds, materialList]);

  return <Box w='100%' alignItems='flex-start'>
    <FlatList
      scrollEnabled={false}
      nestedScrollEnabled
      w='100%'
      // columnWrapperStyle={{
      //   width: '100%',
      //   paddingHorizontal: 10,
      // }}
      data={materialList}
      renderItem={renderItem}
    />
  </Box>;
}
