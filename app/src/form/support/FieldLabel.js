import React from 'react';
import { Text } from '@rneui/themed';
import { styles } from '../styles';

const FieldLabel = ({ label = '' }) => {
  return <Text style={styles.fieldLabel}>{label}</Text>;
};

export default FieldLabel;
