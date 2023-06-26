import React from 'react';
import { View } from 'react-native';
import QuestionField from './QuestionField';
import { styles } from '../styles';

const Question = ({ group, setFieldValue, values }) => {
  const fields = group?.question || [];
  return fields.map((field, keyform) => {
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
