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
import { View } from 'react-native';

const QuestionField = ({ keyform, field: questionField, setFieldValue, values }) => {
  const [field, meta, helpers] = useField(questionField);
  // console.log(field, 'field');
  // console.log(meta, 'meta');
  // console.log(helpers, 'helpers');

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
      {meta.touched && meta.error ? <Text>{meta.error}</Text> : null}
    </View>
  );
};

export default QuestionField;
