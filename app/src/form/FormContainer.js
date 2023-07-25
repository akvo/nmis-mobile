import React, { useState, useRef, useMemo, useEffect } from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import { styles } from './styles';
import { FormNavigation, QuestionGroupList } from './support';
import QuestionGroup from './components/QuestionGroup';
import { transformForm, generateDataPointName } from './lib';
import { FormState } from '../store';

// TODO:: Allow other not supported yet
// TODO:: Repeat group not supported yet

const checkValuesBeforeCallback = (values) =>
  Object.keys(values)
    .map((key) => {
      let value = values[key];
      // check empty
      if (
        typeof value === 'undefined' ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        return false;
      }
      // check array
      if (value && Array.isArray(value)) {
        const check = value.filter((y) => typeof y !== 'undefined' && (y || isNaN(y)));
        value = check.length ? check : null;
      }
      return { [key]: value };
    })
    .filter((v) => v)
    .reduce((res, current) => ({ ...res, ...current }), {});

const FormContainer = ({ forms, initialValues = {}, onSubmit, onSave }) => {
  const formRef = useRef();
  const [activeGroup, setActiveGroup] = useState(0);
  const [showQuestionGroupList, setShowQuestionGroupList] = useState(false);
  const { currentValues, questionGroupListCurrentValues, dataPointName } = FormState.useState(
    (s) => s,
  );

  useEffect(() => {
    const meta = forms.question_group
      .filter((qg) => !qg?.repeatable)
      .flatMap((qg) => qg.question.filter((q) => q?.meta))
      .map((q) => ({ id: q.id, type: q.type, value: initialValues?.[q.id] || null }));
    FormState.update((s) => {
      s.dataPointName = meta;
    });
  }, [forms, initialValues]);

  useEffect(() => {
    if (onSave) {
      const results = checkValuesBeforeCallback(currentValues);
      const { dpName, dpGeo } = generateDataPointName(dataPointName);
      const values = { name: dpName, geo: dpGeo, answers: [results] };
      onSave(values, refreshForm);
    }
  }, [currentValues, onSave]);

  const formDefinition = useMemo(() => {
    return transformForm(forms);
  }, [forms]);

  const currentGroup = useMemo(() => {
    return formDefinition.question_group.find((qg) => qg.id === activeGroup);
  }, [formDefinition, activeGroup]);

  const initialFormValues = useMemo(() => {
    if (Object.keys(initialValues).length) {
      FormState.update((s) => {
        s.currentValues = initialValues;
        s.questionGroupListCurrentValues = initialValues;
      });
      return initialValues;
    }
    return currentValues;
  }, [initialValues, currentValues]);

  const refreshForm = () => {
    FormState.update((s) => {
      s.currentValues = {};
      s.questionGroupListCurrentValues = {};
      s.dataPointName = [];
    });
    formRef.current.resetForm();
  };

  const handleOnSubmitForm = (values) => {
    const results = checkValuesBeforeCallback(values);
    if (onSubmit) {
      const { dpName, dpGeo } = generateDataPointName(dataPointName);
      onSubmit({ name: dpName, geo: dpGeo, answers: [results] }, refreshForm);
    }
  };

  return (
    <>
      <ScrollView>
        <BaseLayout.Content>
          {!showQuestionGroupList ? (
            <Formik
              innerRef={formRef}
              initialValues={initialFormValues}
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
              dataPointNameText={generateDataPointName(dataPointName)?.dpName}
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
        />
      </View>
    </>
  );
};

export default FormContainer;
