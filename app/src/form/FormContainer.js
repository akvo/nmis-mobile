import React, { useState, useRef, useMemo, useEffect } from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import { styles } from './styles';
import { FormNavigation, QuestionGroupList } from './support';
import QuestionGroup from './components/QuestionGroup';
import { transformForm, generateDataPointName } from './lib';
import { FormState, UIState } from '../store';

// TODO:: Allow other not supported yet
// TODO:: Repeat group not supported yet

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
  const activeLang = UIState.useState((s) => s.lang);

  useEffect(() => {
    if (onSave) {
      const results = checkValuesBeforeCallback(currentValues);
      if (!Object.keys(results).length) {
        return onSave(null, refreshForm);
      }
      const { dpName, dpGeo } = generateDataPointName(forms, currentValues, cascades);
      const values = { name: dpName, geo: dpGeo, answers: results };
      return onSave(values, refreshForm);
    }
  }, [currentValues, onSave]);

  const formDefinition = useMemo(() => {
    const transformedForm = transformForm(forms, activeLang);
    FormState.update((s) => {
      s.visitedQuestionGroup = [transformedForm.question_group[0].id];
    });
    return transformedForm;
  }, [forms, activeLang]);

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
    return {};
  }, [initialValues]);

  const refreshForm = () => {
    FormState.update((s) => {
      s.currentValues = {};
      s.questionGroupListCurrentValues = {};
      s.visitedQuestionGroup = [];
      s.cascades = {};
      s.surveyDuration = 0;
    });
    formRef.current?.resetForm();
  };

  const handleOnSubmitForm = (values) => {
    const results = checkValuesBeforeCallback(values);
    if (onSubmit) {
      const { dpName, dpGeo } = generateDataPointName(forms, currentValues, cascades);
      onSubmit({ name: dpName, geo: dpGeo, answers: results }, refreshForm);
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
