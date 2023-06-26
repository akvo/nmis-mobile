import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { Input } from '@rneui/themed';

const TypeNumber = ({ onChange, values, keyform, id, name }) => {
  return (
    <View>
      <FieldLabel keyform={keyform} name={name} />
      <Input
        inputContainerStyle={styles.inputFieldContainer}
        keyboardType="numeric"
        onChangeText={() => {
          if (onChange) {
            onChange(id);
          }
        }}
        value={values?.[id]}
        testID="type-number"
      />
    </View>
  );
};

export default TypeNumber;
