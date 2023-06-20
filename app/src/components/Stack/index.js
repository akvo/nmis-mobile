import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

const Stack = ({ children, row = false, reverse = false, background = '#f9fafb' }) => {
  let flexDir = row ? 'row' : 'column';
  flexDir += reverse ? '-reverse' : '';
  return (
    <View
      style={{
        ...styles.container,
        flexDirection: flexDir,
        backgroundColor: background,
      }}
    >
      {children}
    </View>
  );
};

export default Stack;
