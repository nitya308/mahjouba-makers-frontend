import React from 'react';
import { Center, Button } from 'native-base';

export default function AccountSettingsPage({
  exit,
}: {
  exit: () => void;
}): JSX.Element {
  return <Center h='100%'>
    <Button onPress={exit}>Exit</Button>
  </Center>;
}
