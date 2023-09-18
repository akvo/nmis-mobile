import React from 'react';
import { View } from 'react-native';
import { Text, Icon, Button } from '@rneui/themed';
import Question from './Question';
import { FieldGroupHeader } from '../support';
import { styles } from '../styles';
import { FormState } from '../../store';
import { i18n } from '../../lib';

const RepeatTitle = ({ index, repeat, group }) => {
  const { name } = group;

  return (
    <View style={styles.repeatTitleContainer}>
      <View style={styles.repeatTitleStart}>
        <Text testID="repeat-title">{`${name} - ${repeat + 1}`}</Text>
      </View>
      {group?.repeat > 1 && (
        <View style={styles.repeatTitleEnd}>
          <Icon
            testID="repeat-delete-button"
            name="delete"
            type="material"
            style={styles.repeatDeleteButton}
            onPress={() => console.log(index)}
          />
        </View>
      )}
    </View>
  );
};

const RepeatAddMoreButton = ({ index, group, trans }) => {
  return (
    <View style={styles.repeatAddMoreButtonContainer}>
      <Button
        style={styles.repeatAddMoreButton}
        type="outline"
        onPress={() => console.log('Add Repeat')}
        testID="repeat-add-more-button"
      >
        <Icon name="plus" type="octicon" color={'#3389DC'} style={styles.repeatAddMoreIcon} />
        {trans.addAnother}
      </Button>
    </View>
  );
};

const QuestionGroup = ({ index, group, setFieldValue, values }) => {
  const activeLang = FormState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);

  const repeatable = group?.repeatable || false;
  const repeats = group?.repeats || [0];
  // const repeatText = group?.repeatText || `Number of ${name}`;

  return (
    <View>
      <FieldGroupHeader index={index} {...group} />
      {repeats.map((r) => (
        <View key={r}>
          {repeatable && <RepeatTitle index={index} repeat={r} group={group} />}
          <Question group={group} setFieldValue={setFieldValue} values={values} />
        </View>
      ))}
      {repeatable && <RepeatAddMoreButton index={index} group={group} trans={trans} />}
    </View>
  );
};

export default QuestionGroup;
