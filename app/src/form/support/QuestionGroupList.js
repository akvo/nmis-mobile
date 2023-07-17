import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import QuestionGroupListItem from './QuestionGroupListItem';

export const checkCompleteQuestionGroup = (form, values) => {
  return form.question_group.map((questionGroup) => {
    const filteredQuestions = questionGroup.question.filter((q) => q.required);
    return (
      filteredQuestions
        .map((question) => {
          if (values?.[question.id]) {
            return true;
          }
          return false;
        })
        .filter((x) => x).length === filteredQuestions.length
    );
  });
};

const QuestionGroupList = ({ form, values = {}, activeQuestionGroup }) => {
  const completedQuestionGroup = useMemo(() => {
    return checkCompleteQuestionGroup(form, values);
  });

  return (
    <View>
      <Text testID="form-name">{form.name}</Text>
      {form.question_group.map((questionGroup, qx) => (
        <QuestionGroupListItem
          key={questionGroup.id}
          name={questionGroup.name}
          active={activeQuestionGroup === questionGroup.id}
          completedQuestionGroup={completedQuestionGroup[qx]}
        />
      ))}
    </View>
  );
};

export default QuestionGroupList;
