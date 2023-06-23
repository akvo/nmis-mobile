import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { Input } from '@rneui/themed';

const TypeInput = ({ onChange, values, id, name }) => {
  return (
    <View style={styles.questionContainer}>
      <FieldLabel label={name} />
      <Input
        inputContainerStyle={styles.inputFieldContainer}
        onChangeText={() => {
          if (onChange) {
            onChange(id);
          }
        }}
        value={values?.[id]}
        testID="type-input"
      />
    </View>
  );
};

export default TypeInput;
