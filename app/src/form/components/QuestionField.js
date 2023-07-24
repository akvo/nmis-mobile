import React, { useEffect } from 'react';
import {
  TypeDate,
  TypeImage,
  TypeInput,
  TypeMultipleOption,
  TypeOption,
  TypeText,
  TypeNumber,
  TypeGeo,
} from '../fields';
import { useField } from 'formik';
import { View, Text } from 'react-native';
import { styles } from '../styles';
import { FormState, UIState } from '../../store';

const QuestionField = ({ keyform, field: questionField, setFieldValue, values, validate }) => {
  const [field, meta, helpers] = useField({ name: questionField.id, validate });
  const activeLang = UIState.useState((s) => s.lang);

  useEffect(() => {
    if (meta.error && field.name) {
      FormState.update((s) => {
        const removedErrorValues = Object.keys(s.questionGroupListCurrentValues)
          .filter((key) => key.toString() !== field.name.toString())
          .reduce((acc, curr) => ({ ...acc, [curr]: s.questionGroupListCurrentValues[curr] }), {});
        s.questionGroupListCurrentValues = removedErrorValues;
      });
    } else {
      FormState.update((s) => {
        s.questionGroupListCurrentValues = { ...s.questionGroupListCurrentValues, ...values };
      });
    }
  }, [meta.error, field.name, values]);

  const handleOnChangeField = (id, value) => {
    helpers.setTouched({ [field.name]: true });
    FormState.update((s) => {
      s.currentValues = { ...s.currentValues, [id]: value };
      if (questionField?.meta) {
        s.dataPointName = s.dataPointName.map((dp) =>
          dp.id.toString() === id.toString()
            ? {
                ...dp,
                value: value,
              }
            : dp,
        );
      }
    });
    setFieldValue(id, value);
  };

  const renderField = () => {
    switch (questionField?.type) {
      case 'date':
        return (
          <TypeDate
            keyform={keyform}
            onChange={handleOnChangeField}
            values={values}
            {...questionField}
          />
        );
      case 'image':
        return (
          <TypeImage
            keyform={keyform}
            onChange={handleOnChangeField}
            values={values}
            {...questionField}
          />
        );
      case 'multiple_option':
        return (
          <TypeMultipleOption
            keyform={keyform}
            onChange={handleOnChangeField}
            values={values}
            {...questionField}
          />
        );
      case 'option':
        return (
          <TypeOption
            keyform={keyform}
            onChange={handleOnChangeField}
            values={values}
            {...questionField}
          />
        );
      case 'text':
        return (
          <TypeText
            keyform={keyform}
            onChange={handleOnChangeField}
            values={values}
            lang={activeLang}
            {...questionField}
          />
        );
      case 'number':
        return (
          <TypeNumber
            keyform={keyform}
            onChange={handleOnChangeField}
            values={values}
            {...questionField}
          />
        );
      case 'geo':
        return (
          <TypeGeo
            keyform={keyform}
            onChange={handleOnChangeField}
            values={values}
            {...questionField}
          />
        );
      default:
        return (
          <TypeInput
            keyform={keyform}
            onChange={handleOnChangeField}
            values={values}
            {...questionField}
          />
        );
    }
  };

  return (
    <View>
      {renderField()}
      {meta.touched && meta.error ? (
        <Text style={styles.validationErrorText}>{meta.error}</Text>
      ) : null}
    </View>
  );
};

export default QuestionField;
