import React, { isValidElement } from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { Input, Text } from '@rneui/themed';

export const addPreffix = (addonBefore) => {
  if (!addonBefore) {
    return {};
  }
  const testID = 'field-preffix';
  let element = addonBefore;
  if (element && isValidElement(element)) {
    element = <View testID={testID}>{element}</View>;
  }
  if (element && !isValidElement(element)) {
    element = <Text testID={testID}>{element}</Text>;
  }
  return {
    leftIcon: element,
  };
};

export const addSuffix = (addonAfter) => {
  if (!addonAfter) {
    return {};
  }
  const testID = 'field-suffix';
  let element = addonAfter;
  if (element && isValidElement(element)) {
    element = <View testID={testID}>{element}</View>;
  }
  if (element && !isValidElement(element)) {
    element = <Text testID={testID}>{element}</Text>;
  }
  return {
    rightIcon: element,
  };
};

const TypeInput = ({ onChange, values, keyform, id, name, addonAfter, addonBefore }) => {
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
        {...addPreffix(addonBefore)}
        {...addSuffix(addonAfter)}
      />
    </View>
  );
};

export default TypeInput;
