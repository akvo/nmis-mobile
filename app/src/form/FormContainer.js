import React, { useState, useRef, useMemo, useEffect } from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import { styles } from './styles';
import { FormNavigation, QuestionGroupList } from './support';
import QuestionGroup from './components/QuestionGroup';
import { transformForm, generateDataPointName, range } from './lib';
import { FormState } from '../store';

// TODO:: Allow other not supported yet

const checkValuesBeforeCallback = (values) =>
  Object.keys(values)
    .map((key) => {
      let value = values[key];
      if (typeof value === 'string') {
        value = value.trim();
      }
      // check array
      if (value && Array.isArray(value)) {
        const check = value.filter((y) => typeof y !== 'undefined' && (y || isNaN(y)));
        value = check.length ? check : null;
      }
      // check empty
      if (!value && value !== 0) {
        return false;
      }
      return { [key]: value };
    })
    .filter((v) => v)
    .reduce((res, current) => ({ ...res, ...current }), {});

const FormContainer = ({ forms, initialValues = {}, onSubmit, onSave, setShowDialogMenu }) => {
  const formRef = useRef();
  const [activeGroup, setActiveGroup] = useState(0);
  const [showQuestionGroupList, setShowQuestionGroupList] = useState(false);
  const currentValues = FormState.useState((s) => s.currentValues);
  const questionGroupListCurrentValues = FormState.useState(
    (s) => s.questionGroupListCurrentValues,
  );
  const cascades = FormState.useState((s) => s.cascades);
  const activeLang = FormState.useState((s) => s.lang);
  const [updatedQuestionGroup, setUpdatedQuestionGroup] = useState([]);

  useEffect(() => {
    if (onSave) {
      const results = checkValuesBeforeCallback(currentValues);
      if (!Object.keys(results).length) {
        return onSave(null);
      }
      const { dpName, dpGeo } = generateDataPointName(forms, currentValues, cascades);
      const values = { name: dpName, geo: dpGeo, answers: results };
      return onSave(values);
    }
  }, [currentValues, onSave]);

  useEffect(() => {
    if (Object.keys(initialValues).length) {
      const initialValuesTmp = Object.keys(initialValues).map((key) => {
        let repeat = 0;
        let question = key;
        if (key.includes('-')) {
          const tmp = key.split('-');
          question = tmp[0];
          repeat = tmp[1];
        }
        return {
          question: parseInt(question),
          value: initialValues[key],
          repeat: parseInt(repeat),
        };
      });
      const groupRepeats = transformForm(forms)?.question_group?.map((qg) => {
        const q = initialValuesTmp.filter((i) => qg.question.map((q) => q.id).includes(i.question));
        const maxRepeat = q.reduce((max, item) => {
          return item.repeat > max ? item.repeat : max;
        }, 0);
        if (maxRepeat) {
          return { ...qg, repeat: maxRepeat + 1, repeats: range(maxRepeat + 1) };
        }
        return qg;
      });
      setUpdatedQuestionGroup(groupRepeats);
    }
  }, []);

  const formDefinition = useMemo(() => {
    let transformedForm = transformForm(forms, activeLang);
    FormState.update((s) => {
      s.visitedQuestionGroup = [transformedForm.question_group[0].id];
    });
    if (updatedQuestionGroup.length) {
      transformedForm = {
        ...transformedForm,
        question_group: updatedQuestionGroup,
      };
    }
    return transformedForm;
  }, [forms, activeLang, updatedQuestionGroup]);

  const currentGroup = useMemo(() => {
    return formDefinition.question_group.find((qg) => qg.id === activeGroup);
  }, [formDefinition, activeGroup]);

  const handleOnSubmitForm = (values) => {
    const results = checkValuesBeforeCallback(values);
    if (onSubmit) {
      const { dpName, dpGeo } = generateDataPointName(forms, currentValues, cascades);
      onSubmit({ name: dpName, geo: dpGeo, answers: results });
    }
  };

  const updateRepeat = (index, value, operation, repeatIndex = null) => {
    const updated = formDefinition.question_group.map((x, xi) => {
      const isRepeatsAvailable = x?.repeats && x?.repeats?.length;
      const repeatNumber = isRepeatsAvailable ? x.repeats[x.repeats.length - 1] + 1 : value - 1;
      let repeats = isRepeatsAvailable ? x.repeats : [0];
      if (xi === index) {
        if (operation === 'add') {
          repeats = [...repeats, repeatNumber];
        }
        if (operation === 'delete') {
          repeats.pop();
        }
        if (operation === 'delete-selected' && repeatIndex !== null) {
          // delete current value
          const qids = x.question.map((q) => q.id);
          const deletedQids = qids.map((q) => `${q.id}-${repeatIndex}`);
          let updatedCurrentValues = {};
          for (const key in currentValues) {
            if (!deletedQids.includes(key)) {
              updatedCurrentValues = {
                ...updatedCurrentValues,
                [key]: currentValues[key],
              };
            }
          }
          // remap repeat index
          for (const key in updatedCurrentValues) {
            const keyQid = key.split('-')[0];
            const repeat = key.split('-')?.[1];
            if (qids.includes(parseInt(keyQid)) && repeat > repeatIndex) {
              const newRepeat = parseInt(repeat) - 1;
              const newKey = newRepeat ? `${keyQid}-${newRepeat}` : keyQid;
              updatedCurrentValues = {
                ...updatedCurrentValues,
                [newKey]: updatedCurrentValues[key],
              };
              formRef.current.setFieldValue(newKey, updatedCurrentValues[key]);
              formRef.current.setFieldValue(key, null);
              delete updatedCurrentValues[key];
            }
          }
          // eol remap repeat index
          FormState.update((s) => {
            s.currentValues = updatedCurrentValues;
          });
          // eol delete current value
          repeats = repeats.filter((r) => r !== repeatIndex);
          repeats = range(repeats.length);
        }
        return { ...x, repeat: value, repeats: repeats };
      }
      return x;
    });
    setUpdatedQuestionGroup(updated);
  };

  return (
    <>
      <ScrollView>
        <BaseLayout.Content>
          {!showQuestionGroupList ? (
            <Formik
              innerRef={formRef}
              initialValues={initialValues}
              onSubmit={handleOnSubmitForm}
              validateOnBlur={true}
              validateOnChange={true}
            >
              {({ setFieldValue, values }) => (
                <View style={styles.formContainer}>
                  {formDefinition?.question_group?.map((group) => {
                    if (activeGroup !== group.id) {
                      return '';
                    }
                    return (
                      <QuestionGroup
                        key={`group-${group.id}`}
                        index={group.id}
                        group={group}
                        setFieldValue={setFieldValue}
                        values={values}
                        updateRepeat={updateRepeat}
                      />
                    );
                  })}
                </View>
              )}
            </Formik>
          ) : (
            <QuestionGroupList
              form={formDefinition}
              values={questionGroupListCurrentValues}
              activeQuestionGroup={activeGroup}
              setActiveQuestionGroup={setActiveGroup}
              setShowQuestionGroupList={setShowQuestionGroupList}
            />
          )}
        </BaseLayout.Content>
      </ScrollView>
      <View>
        <FormNavigation
          currentGroup={currentGroup}
          formRef={formRef}
          onSubmit={() => {
            if (formRef.current) {
              formRef.current.handleSubmit();
            }
          }}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
          totalGroup={formDefinition?.question_group?.length || 0}
          showQuestionGroupList={showQuestionGroupList}
          setShowQuestionGroupList={setShowQuestionGroupList}
          setShowDialogMenu={setShowDialogMenu}
        />
      </View>
    </>
  );
};

export default FormContainer;
