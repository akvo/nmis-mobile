import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { CheckBox } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';
import { i18n } from '../../lib';

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
  required,
  requiredSign,
}) => {
  const isRadioGroup = React.useMemo(() => {
    return option.length <= 3;
  }, [option]);

  const translatedOptions = i18n.options(lang, option);

  return (
    <View style={styles.optionContainer}>
      <FieldLabel
        keyform={keyform}
        name={name}
        lang={lang}
        tooltip={tooltip}
        translations={translations}
        requiredSign={required ? requiredSign : null}
      />
      {isRadioGroup ? (
        translatedOptions.map((opt, opti) => (
          <CheckBox
            key={opti}
            containerStyle={styles.radioFieldContainer}
            textStyle={styles.radioFieldText}
            checked={values?.[id]?.includes(opt.name)}
            onPress={() => {
              onChange(id, [opt.name]);
            }}
            title={opt.label}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            testID={`type-option-radio-${opti}`}
          />
        ))
      ) : (
        <Dropdown
          style={[styles.dropdownField]}
          data={translatedOptions}
          search
          maxHeight={300}
          labelField="label"
          valueField="name"
          searchPlaceholder="Search..."
          value={values?.[id]?.[0] || []}
          onChange={({ value }) => {
            onChange(id, [value]);
          }}
          testID="type-option-dropdown"
        />
      )}
    </View>
  );
};

export default TypeOption;
