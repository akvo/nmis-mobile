import React from 'react';
import { View } from 'react-native';
import Question from './Question';
import { FieldGroupHeader } from '../support';

const QuestionGroup = ({ index, group, setFieldValue, values }) => {
  const repeats = group?.repeats || [];
  // const { name, repeat, repeats, repeatButtonPlacement } = group;
  // const repeatText = group?.repeatText || `Number of ${name}`;

  return (
    <View>
      <FieldGroupHeader index={index} {...group} />
      {repeats.map((r) => (
        <View>Repeat title</View>
      ))}
      <Question group={group} setFieldValue={setFieldValue} values={values} />
    </View>
  );
};

export default QuestionGroup;
