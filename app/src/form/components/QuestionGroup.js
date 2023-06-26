import React from 'react';
import { View } from 'react-native';
import Question from './Question';
import { FieldGroupHeader } from '../support';

const QuestionGroup = ({ index, group }) => {
  return (
    <View key={`group-${index}`}>
      <FieldGroupHeader index={index} {...group} />
      <Question group={group} />
    </View>
  );
};

export default QuestionGroup;
