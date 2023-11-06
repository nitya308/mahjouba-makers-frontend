import React, { useMemo } from 'react';
import { HStack, Box } from 'native-base';

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

  return <HStack>
    {
      dots.map((dot) => (
        <Box w='5px' h='5px' outlineColor='black' bgColor={dot === 1 ? 'black' : 'transparent' }/>
      ))
    }
  </HStack>;
}