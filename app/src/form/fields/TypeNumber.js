import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { Input } from '@rneui/themed';
import { addPreffix, addSuffix } from './TypeInput';

const TypeNumber = ({
  onChange,
  values,
  keyform,
  id,
  name,
  addonAfter,
  addonBefore,
  lang,
  tooltip,
  translations,
}) => {
  return (
    <View>
      <FieldLabel
        keyform={keyform}
        name={name}
        lang={lang}
        tooltip={tooltip}
        translations={translations}
      />
      <Input
        inputContainerStyle={styles.inputFieldContainer}
        keyboardType="numeric"
        onChangeText={(val) => {
          if (onChange) {
            onChange(id, val);
          }
        }}
        value={values?.[id]}
        testID="type-number"
        {...addPreffix(addonBefore)}
        {...addSuffix(addonAfter)}
      />
    </View>
  );
};

export default TypeNumber;
