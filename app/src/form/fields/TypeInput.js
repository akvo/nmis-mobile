import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { Input, Text } from '@rneui/themed';

const TypeInput = ({ onChange, values, keyform, id, name }) => {
  return (
    <View>
      <FieldLabel keyform={keyform} name={name} />
      <Input
        inputContainerStyle={styles.inputFieldContainer}
        onChangeText={(val) => {
          if (onChange) {
            onChange(id, val);
          }
        }}
        value={values?.[id]}
        testID="type-input"
        // leftIcon={<Text>Test</Text>}
        // rightIcon={<Text>Test</Text>}
      />
    </View>
  );
};

export default TypeInput;
