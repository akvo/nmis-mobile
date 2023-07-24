import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { CheckBox } from '@rneui/themed';
import { MultiSelect } from 'react-native-element-dropdown';
import { i18n } from '../../lib';

const TypeMultipleOption = ({
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
  const translatedOptions = i18n.options(lang, option);

  const isCheckBox = React.useMemo(() => {
    return option.length <= 3;
  }, [translatedOptions]);

  return (
    <View style={styles.multipleOptionContainer}>
      <FieldLabel
        keyform={keyform}
        name={name}
        lang={lang}
        tooltip={tooltip}
        translations={translations}
      />
      {isCheckBox ? (
        translatedOptions.map((opt, opti) => (
          <CheckBox
            key={opti}
            containerStyle={styles.radioFieldContainer}
            textStyle={styles.radioFieldText}
            checked={values?.[id]?.includes(opt.name)}
            onPress={() => {
              values?.[id]?.includes(opt.name)
                ? onChange(`${id}.${opti}`, null)
                : onChange(`${id}.${opti}`, opt.name);
            }}
            title={opt.label}
          />
        ))
      ) : (
        <MultiSelect
          style={[styles.dropdownField]}
          selectedStyle={styles.dropdownSelectedList}
          data={translatedOptions}
          search
          maxHeight={300}
          labelField="label"
          valueField="name"
          searchPlaceholder="Search..."
          value={values?.[id] || []}
          onChange={(value) => {
            onChange(id, value);
          }}
          testID="type-multiple-option-dropdown"
        />
      )}
    </View>
  );
};

export default TypeMultipleOption;
