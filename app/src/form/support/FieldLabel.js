import React from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { styles } from '../styles';

const FieldLabel = ({ keyform, name = '', requiredSign = null }) => {
  return (
    <View style={styles.fieldLabelContainer}>
      {requiredSign && (
        <Text style={styles.fieldRequiredIcon} testID="field-required-icon">
          {requiredSign}
        </Text>
      )}
      <Text style={styles.fieldLabel} testID="field-label">
        {!isNaN(keyform) ? `${keyform + 1}. ${name}` : name}
      </Text>
    </View>
  );
};

export default FieldLabel;
