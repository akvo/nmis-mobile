import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { CheckBox } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';

const TypeOption = ({
  onChange,
  values,
  keyform,
  id,
  name,
  option = [],
  lang,
  tooltip,
  translations,
}) => {
  const isRadioGroup = React.useMemo(() => {
    return option.length <= 3;
  }, [option]);

  return (
    <View style={styles.optionContainer}>
      <FieldLabel
        keyform={keyform}
        name={name}
        lang={lang}
        tooltip={tooltip}
        translations={translations}
      />
      {isRadioGroup ? (
        option.map((opt, opti) => (
          <CheckBox
            key={opti}
            containerStyle={styles.radioFieldContainer}
            textStyle={styles.radioFieldText}
            checked={values?.[id]?.includes(opt.name)}
            onPress={() => {
              if (onChange) {
                onChange(id, [opt.name]);
              }
            }}
            title={opt.label}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
        ))
      ) : (
        <Dropdown
          style={[styles.dropdownField]}
          data={option.map((opt) => ({ label: opt.label, value: opt.name }))}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={values?.[id]?.[0] || []}
          onChange={({ value }) => {
            if (onChange) {
              onChange(id, [value]);
            }
          }}
          testID="type-option-dropdown"
        />
      )}
    </View>
  );
};

export default TypeOption;
