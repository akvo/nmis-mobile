import React from 'react';
import { View } from 'react-native';
import { Text, Icon, Button } from '@rneui/themed';
import Question from './Question';
import { FieldGroupHeader } from '../support';
import { styles } from '../styles';
import { FormState } from '../../store';
import { i18n } from '../../lib';

const RepeatTitle = ({ index, repeat, group, updateRepeat }) => {
  const { name } = group;
  return (
    <View style={styles.repeatTitleContainer}>
      <View style={styles.repeatTitleStart}>
        <Text testID={`repeat-title-${repeat}`}>{`${name} - ${repeat + 1}`}</Text>
      </View>
      {group?.repeat > 1 && (
        <View style={styles.repeatTitleEnd}>
          <Icon
            testID={`repeat-delete-button-${repeat}`}
            name="delete"
            type="material"
            style={styles.repeatDeleteButton}
            onPress={() => updateRepeat(index, group?.repeat - 1, 'delete-selected', repeat)}
          />
        </View>
      )}
    </View>
  );
};

const RepeatAddMoreButton = ({ index, group, trans, updateRepeat }) => {
  const repeat = group?.repeat || 0;
  return (
    <View style={styles.repeatAddMoreButtonContainer}>
      <Button
        style={styles.repeatAddMoreButton}
        type="outline"
        onPress={() => updateRepeat(index, repeat + 1, 'add')}
        testID="repeat-add-more-button"
      >
        <Icon name="plus" type="octicon" color={'#3389DC'} style={styles.repeatAddMoreIcon} />
        {trans.addAnother}
      </Button>
    </View>
  );
};

const QuestionGroup = ({ index, group, setFieldValue, values, updateRepeat }) => {
  const activeLang = FormState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);

  const repeatable = group?.repeatable || false;
  const repeats = group?.repeats || [0];

  return (
    <View>
      <FieldGroupHeader index={index} {...group} />
      {repeats.map((r) => (
        <View key={r}>
          {repeatable && (
            <RepeatTitle index={index} repeat={r} group={group} updateRepeat={updateRepeat} />
          )}
          <Question group={group} repeat={r} setFieldValue={setFieldValue} values={values} />
        </View>
      ))}
      {repeatable && (
        <RepeatAddMoreButton
          index={index}
          group={group}
          trans={trans}
          updateRepeat={updateRepeat}
        />
      )}
    </View>
  );
};

export default QuestionGroup;
