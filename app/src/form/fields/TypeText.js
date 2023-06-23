import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { Input } from '@rneui/themed';

const TypeText = ({ onChange, values, id, name }) => {
  return (
    <View style={styles.questionContainer}>
      <FieldLabel label={name} />
      <Input
        inputContainerStyle={styles.inputFieldContainer}
        multiline={true}
        numberOfLines={4}
        onChangeText={onChange(id)}
        value={values?.[id]}
        testID="type-text"
      />
    </View>
  );
};

export default TypeText;
