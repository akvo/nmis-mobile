import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem } from '@rneui/themed';

import { FormState } from '../../store';
import { cascades } from '../../lib';
import { BaseLayout } from '../../components';
import FormDataNavigation from './FormDataNavigation';

const SubtitleContent = ({ index, answers, type, id, source }) => {
  const [cascadeValue, setCascadeValue] = useState(null);

  const fetchCascade = useCallback(async () => {
    if (source) {
      const cascadeID = parseInt(answers?.[id], 10);
      const { rows } = await cascades.loadDataSource(source, cascadeID);
      const { length: rowLength, _array: rowItems } = rows || {};
      const csValue = rowLength ? rowItems[0] : null;
      setCascadeValue(csValue);
    }
  }, [answers, id, source]);

  useEffect(() => {
    fetchCascade();
  }, [fetchCascade]);

  switch (type) {
    case 'geo':
      return (
        <View testID={`text-type-geo-${index}`}>
          <Text>Latitude: {answers?.[id]?.[0]}</Text>
          <Text>Longitude: {answers?.[id]?.[1]}</Text>
        </View>
      );

      break;
    case 'cascade':
      return <Text testID={`text-answer-${index}`}>{cascadeValue ? cascadeValue.name : '-'}</Text>;
      break;
    default:
      return <Text testID={`text-answer-${index}`}>{answers?.[id] || '-'}</Text>;
      break;
  }
};

const FormDataDetails = ({ navigation, route }) => {
  const selectedForm = FormState.useState((s) => s.form);
  const currentValues = FormState.useState((s) => s.currentValues);
  const [currentPage, setCurrentPage] = useState(0);

  const { json: formJSON } = selectedForm || {};

  const form = formJSON ? JSON.parse(formJSON) : {};
  const currentGroup = form?.question_group?.[currentPage] || [];
  const totalPage = form?.question_group?.length || 0;
  const questions = currentGroup?.question || [];

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        if (Object.keys(currentValues).length) {
          FormState.update((s) => {
            s.currentValues = {};
          });
          navigation.dispatch(e.data.action);
        } else {
          return;
        }
      }),
    [navigation, currentValues],
  );

  return (
    <BaseLayout title={route?.params?.name} rightComponent={false}>
      <ScrollView>
        {questions?.map((q, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={styles.title} testID={`text-question-${i}`}>
                {q.name}
              </ListItem.Title>
              <ListItem.Subtitle>
                <SubtitleContent index={i} answers={currentValues} {...q} />
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
      <FormDataNavigation
        totalPage={totalPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 4,
  },
});

export default FormDataDetails;
