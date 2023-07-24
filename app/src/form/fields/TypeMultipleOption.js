import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { CheckBox } from '@rneui/themed';
import { MultiSelect } from 'react-native-element-dropdown';

const TypeMultipleOption = ({
  onChange,
  values,
  keyform,
  id,
  name,
  option = [],
  required,
  requiredSign,
}) => {
  const isCheckBox = React.useMemo(() => {
    return option.length <= 3;
  }, [option]);

  return (
    <View style={styles.multipleOptionContainer}>
      <FieldLabel keyform={keyform} name={name} requiredSign={required ? requiredSign : null} />
      {isCheckBox ? (
        option.map((opt, opti) => (
          <CheckBox
            key={opti}
            containerStyle={styles.radioFieldContainer}
            textStyle={styles.radioFieldText}
            checked={values?.[id]?.includes(opt.name)}
            onPress={() => {
              if (onChange) {
                values?.[id]?.includes(opt.name)
                  ? onChange(`${id}.${opti}`, null)
                  : onChange(`${id}.${opti}`, opt.name);
              }
            }}
            title={opt.label}
          />
        ))
      ) : (
        <MultiSelect
          style={[styles.dropdownField]}
          selectedStyle={styles.dropdownSelectedList}
          data={option.map((opt) => ({ label: opt.label, value: opt.name }))}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={values?.[id] || []}
          onChange={(value) => {
            if (onChange) {
              onChange(id, value);
            }
          }}
          testID="type-multiple-option-dropdown"
        />
      )}
    </View>
  );
};

export default TypeMultipleOption;
