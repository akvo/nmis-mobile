import React from 'react';
import { View } from 'react-native';
import QuestionField from './QuestionField';
import { styles } from '../styles';
import { modifyDependency, validateDependency } from '../lib';

const Question = ({ group, setFieldValue, values }) => {
  const fields = group?.question || [];
  return fields.map((field, keyform) => {
    if (field?.dependency) {
      const repeat = 0;
      const modifiedDependency = modifyDependency(group, field, repeat);
      const unmatches = modifiedDependency
        .map((x) => {
          return validateDependency(x, values?.[x.id]);
        })
        .filter((x) => x === false);
      return unmatches.length ? null : (
        <View key={`question-${field.id}`} style={styles.questionContainer}>
          <QuestionField
            keyform={keyform}
            field={field}
            setFieldValue={setFieldValue}
            values={values}
          />
        </View>
      );
    }
    return (
      <View key={`question-${field.id}`} style={styles.questionContainer}>
        <QuestionField
          keyform={keyform}
          field={field}
          setFieldValue={setFieldValue}
          values={values}
        />
      </View>
    );
  });
};

export default Question;
