import React, { PropsWithChildren, ReactNode } from 'react';
import { Button, Icon } from 'native-base';
import Colors from 'utils/Colors';
import { IButtonProps } from 'native-base/lib/typescript/components/primitives/Button';

export default function SharpButton({
  children,
  leftIcon,
  rightIcon,
  ...props
}: PropsWithChildren<{
  children?: ReactNode,
  leftIcon?: JSX.Element,
  rightIcon?: JSX.Element,
} & IButtonProps>): JSX.Element {
  return <Button
    bgColor= '#3A3449'
    outlineColor='black'
    padding={2.5}
    paddingLeft={5}
    paddingRight={5}
    borderRadius={40}
    leftIcon={leftIcon}
    rightIcon={rightIcon}
    _pressed={{
      opacity: 0.5,
      style: {
        shadowColor: '#000',
        shadowOffset: {
          width: -1,
          height: 1,
        },
        shadowRadius: 0,
        shadowOpacity: 1,
      },
      ml: '-3px',
    }}
    {...props}>
    {children}
  </Button>;
}