import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { styles } from '../styles';

const QuestionGroupListItem = ({ name, active, completedQuestionGroup = false }) => {
  const icon = completedQuestionGroup ? 'check-circle' : 'circle';
  const bgColor = completedQuestionGroup ? '#2884bd' : '#d4d4d4';
  const activeOpacity = active ? styles.questionGroupListItemActive : {};
  return (
    <TouchableOpacity
      style={{ ...styles.questionGroupListItemWrapper, ...activeOpacity }}
      testID="question-group-list-item-wrapper"
      disabled={!completedQuestionGroup}
    >
      <Icon
        testID="icon-mark"
        name={icon}
        type="font-awesome"
        color={bgColor}
        style={styles.questionGroupListItemIcon}
      />
      <Text style={styles.questionGroupListItemName}>{name}</Text>
    </TouchableOpacity>
  );
};

export default QuestionGroupListItem;
