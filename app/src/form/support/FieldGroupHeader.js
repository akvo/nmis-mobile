import React from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { styles } from '../styles';

const FieldGroupHeader = ({ name = '', description = '' }) => {
  return (
    <View>
      <View style={styles.fieldGroupHeader}>
        <Text style={styles.fieldGroupName}>{name}</Text>
      </View>
      <Text style={styles.fieldGroupDescription}>{description}</Text>
    </View>
  );
};

export default FieldGroupHeader;
