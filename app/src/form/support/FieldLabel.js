import React from 'react';
import { Text } from '@rneui/themed';
import { styles } from '../styles';

const FieldLabel = ({ keyform, name = '' }) => {
  return (
    <Text style={styles.fieldLabel} testID="field-label">
      {!isNaN(keyform) ? `${keyform + 1}. ${name}` : name}
    </Text>
  );
};

export default FieldLabel;
