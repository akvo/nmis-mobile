import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text, Divider } from '@rneui/themed';
import QuestionGroupListItem from './QuestionGroupListItem';
import { validateDependency, modifyDependency } from '../lib';
import { styles } from '../styles';
import { FormState } from '../../store';

export const checkCompleteQuestionGroup = (form, values) => {
  return form.question_group.map((questionGroup) => {
    const filteredQuestions = questionGroup.question.filter((q) => q.required);
    return (
      filteredQuestions
        .map((question) => {
          if (question?.dependency) {
            const repeat = 0;
            const modifiedDependency = modifyDependency(questionGroup, question, repeat);
            const unmatches = modifiedDependency
              .map((x) => {
                return validateDependency(x, values?.[x.id]);
              })
              .filter((x) => x === false);
            if (unmatches.length) {
              return true;
            }
          }
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
  dataPointNameText = null,
  activeQuestionGroup,
  setActiveQuestionGroup,
  setShowQuestionGroupList,
}) => {
  const visitedQuestionGroup = FormState.useState((s) => s.visitedQuestionGroup);

  const completedQuestionGroup = useMemo(() => {
    return checkCompleteQuestionGroup(form, values);
  });

  const handleOnPress = (questionGroupId) => {
    setActiveQuestionGroup(questionGroupId);
    setShowQuestionGroupList(false);
  };

  return (
    <View style={styles.questionGroupListContainer}>
      <Text style={styles.questionGroupListFormTitle} testID="form-name">
        {form.name}
      </Text>
      <Divider style={styles.divider} />
      {dataPointNameText && (
        <>
          <Text style={styles.questionGroupListDataPointName} testID="datapoint-name">
            {dataPointNameText}
          </Text>
          <Divider style={styles.divider} />
        </>
      )}
      {form.question_group.map((questionGroup, qx) => (
        <QuestionGroupListItem
          key={questionGroup.id}
          name={questionGroup.name}
          active={activeQuestionGroup === questionGroup.id}
          completedQuestionGroup={
            completedQuestionGroup[qx] && visitedQuestionGroup.includes(questionGroup.id)
          }
          onPress={() => handleOnPress(questionGroup.id)}
        />
      ))}
    </View>
  );
};

export default QuestionGroupList;
