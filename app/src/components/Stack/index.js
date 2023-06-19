import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

const Stack = ({ children, row = false, reverse = false, background = '#f9fafb' }) => {
  const flexDir = `{row ? 'row' : 'column'}{reverse ? '-reverse' : ''}`;
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
