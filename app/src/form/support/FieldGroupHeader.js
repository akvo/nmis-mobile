import React from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { styles } from '../styles';

const FieldGroupHeader = ({ index, name = '', description = '' }) => {
  return (
    <View>
      <View style={styles.fieldGroupHeader}>
        <Text style={styles.fieldGroupName} testID="text-name">
          {!isNaN(index) ? `${index + 1}. ${name}` : name}
        </Text>
      </View>
      <View style={styles.fieldGroupDescContainer}>
        {description && (
          <Text style={styles.fieldGroupDescription} testID="text-description">
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};

export default FieldGroupHeader;
