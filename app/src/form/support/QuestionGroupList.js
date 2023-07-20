import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text, Divider } from '@rneui/themed';
import QuestionGroupListItem from './QuestionGroupListItem';
import { styles } from '../styles';

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

const QuestionGroupList = ({
  form,
  values = {},
  activeQuestionGroup,
  setActiveQuestionGroup,
  setShowQuestionGroupList,
}) => {
  const completedQuestionGroup = useMemo(() => {
    return checkCompleteQuestionGroup(form, values);
  });

  const handleOnPress = (questionGroupId) => {
    setActiveQuestionGroup(questionGroupId);
    setShowQuestionGroupList(false);
  };

  console.log('qgl', values);

  return (
    <View style={styles.questionGroupListContainer}>
      <Text style={styles.questionGroupListFormTitle} testID="form-name">
        {form.name}
      </Text>
      <Divider style={styles.divider} />
      <Text style={styles.questionGroupListDataPointName} testID="datapoint-name">
        Data Point name here
      </Text>
      <Divider style={styles.divider} />
      {form.question_group.map((questionGroup, qx) => (
        <QuestionGroupListItem
          key={questionGroup.id}
          name={questionGroup.name}
          active={activeQuestionGroup === questionGroup.id}
          completedQuestionGroup={completedQuestionGroup[qx]}
          onPress={() => handleOnPress(questionGroup.id)}
        />
      ))}
    </View>
  );
};

export default QuestionGroupList;
