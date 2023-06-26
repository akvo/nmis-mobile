import React from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { styles } from '../styles';

const FieldGroupHeader = ({ index, name = '', description = '' }) => {
  return (
    <View>
      <View style={styles.fieldGroupHeader}>
        <Text style={styles.fieldGroupName}>{!isNaN(index) ? `${index + 1}. ${name}` : name}</Text>
      </View>
      <Text style={styles.fieldGroupDescription}>{description}</Text>
    </View>
  );
};

export default FieldGroupHeader;
