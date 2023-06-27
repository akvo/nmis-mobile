import React from 'react';
import {
  TypeDate,
  TypeImage,
  TypeInput,
  TypeMultipleOption,
  TypeOption,
  TypeText,
  TypeNumber,
} from '../fields';
import { useField } from 'formik';
import { View, Text } from 'react-native';
import { styles } from '../styles';

const QuestionField = ({ keyform, field: questionField, setFieldValue, values, validate }) => {
  const [field, meta, helpers] = useField({ name: questionField.id, validate });

  if (meta.error && questionField.id === 364240038) {
    console.log(field, 'FIELD');
    console.log(meta, 'META');
  }

  const renderField = () => {
    switch (questionField?.type) {
      case 'date':
        return (
          <TypeDate keyform={keyform} onChange={setFieldValue} values={values} {...questionField} />
        );
      case 'image':
        return (
          <TypeImage
            keyform={keyform}
            onChange={setFieldValue}
            values={values}
            {...questionField}
          />
        );
      case 'multiple_option':
        return (
          <TypeMultipleOption
            keyform={keyform}
            onChange={setFieldValue}
            values={values}
            {...questionField}
          />
        );
      case 'option':
        return (
          <TypeOption
            keyform={keyform}
            onChange={setFieldValue}
            values={values}
            {...questionField}
          />
        );
      case 'text':
        return (
          <TypeText keyform={keyform} onChange={setFieldValue} values={values} {...questionField} />
        );
      case 'number':
        return (
          <TypeNumber
            keyform={keyform}
            onChange={setFieldValue}
            values={values}
            {...questionField}
          />
        );
      default:
        return (
          <TypeInput
            keyform={keyform}
            onChange={setFieldValue}
            values={values}
            {...questionField}
          />
        );
    }
  };

  return (
    <View>
      {renderField()}
      {meta.error ? <Text style={styles.validationErrorText}>{meta.error}</Text> : null}
    </View>
  );
};

export default QuestionField;
