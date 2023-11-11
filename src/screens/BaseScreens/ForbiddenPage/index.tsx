import React from 'react';
import BaseView from 'components/BaseView';
import { Text } from 'native-base';
import { fonts } from 'utils/constants';

const ForbiddenPage = () => {
  return (
    <BaseView>
      <Text color="white" fontSize={24} fontFamily={fonts.medium}>
        403 - Forbidden
      </Text>
      <Text color="white" fontSize={24} fontFamily={fonts.medium}>
        You do not have permissions to view this page.
      </Text>
    </BaseView>
  );
};

export default ForbiddenPage;
