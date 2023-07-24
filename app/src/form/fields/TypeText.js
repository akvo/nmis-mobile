import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { Input } from '@rneui/themed';

const TypeText = ({ onChange, values, keyform, id, name, required, requiredSign }) => {
  return (
    <View>
      <FieldLabel keyform={keyform} name={name} requiredSign={required ? requiredSign : null} />
      <Input
        inputContainerStyle={styles.inputFieldContainer}
        multiline={true}
        numberOfLines={4}
        onChangeText={(val) => {
          if (onChange) {
            onChange(id, val);
          }
        }}
        value={values?.[id]}
        testID="type-text"
      />
    </View>
  );
};

export default TypeText;
