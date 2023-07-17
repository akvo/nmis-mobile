import React, { useEffect, useState } from 'react';
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
import { FormState } from '../../store';

const QuestionField = ({ keyform, field: questionField, setFieldValue, values, validate }) => {
  const [field, meta, helpers] = useField({ name: questionField.id, validate });
  const [currentFieldValue, setCurrentFieldValue] = useState({});

  useEffect(() => {
    if (!meta?.error) {
      FormState.update((s) => {
        s.currentValues = { ...s.currentValues, ...currentFieldValue };
      });
    } else {
      delete values?.[questionField.id];
      FormState.update((s) => {
        s.currentValues = values;
      });
    }
  }, [meta]);

  const handleOnChangeField = (id, value) => {
    helpers.setTouched({ [field.name]: true });
    setCurrentFieldValue({ [id]: value });
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
