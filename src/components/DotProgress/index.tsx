import React, { useMemo } from 'react';
import { HStack, Box, Spacer } from 'native-base';

export default function DotProgress({
  progress,
  completion,
}: {
  progress: number,
  completion: number,
}): JSX.Element {
  const dots = useMemo(() => {
    const res = [];
    for (let i = 0; i < completion; i ++) {
      if (i === progress) {
        res.push(1);
      } else {
        res.push(0);
      }
    }
    return res;
  }, [progress, completion]);

  return <HStack w='100%' space={2} my='5px'>
    <Spacer />
    {
      dots.map((dot, i) => (
        <Box key={i} w='10px' h='10px' borderColor='black' bgColor={dot === 1 ? 'black' : 'transparent' } borderWidth='1px'  borderRadius='full' />
      ))
    }
    <Spacer />
  </HStack>;
}