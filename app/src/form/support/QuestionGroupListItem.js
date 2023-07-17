import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';

const QuestionGroupListItem = ({ name, active, completedQuestionGroup = false }) => {
  const icon = completedQuestionGroup ? 'checked' : 'unchecked';
  const bgColor = completedQuestionGroup ? 'blue' : 'gray';
  const activeOpacity = active ? 'gray' : 'transparent';
  return (
    <TouchableOpacity
      testID="question-group-list-item-wrapper"
      style={{ backgroundColor: activeOpacity }}
      disabled={!completedQuestionGroup}
    >
      <i testID="icon-mark" style={{ backgroundColor: bgColor }} className={icon} />
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};

export default QuestionGroupListItem;
