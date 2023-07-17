import React, { useState, useRef, useMemo } from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import { styles } from './styles';
import { FormNavigation, QuestionGroupList } from './support';
import QuestionGroup from './components/QuestionGroup';
import { transformForm } from './lib';

// TODO:: Allow other not supported yet
// TODO:: Repeat group not supported yet
// TODO:: Cascade not supported yet

const FormContainer = ({ forms, initialValues = {} }) => {
  const formRef = useRef();
  const [activeGroup, setActiveGroup] = useState(0);
  const [showQuestionGroupList, setShowQuestionGroupList] = useState(false);

  const formDefinition = useMemo(() => {
    return transformForm(forms);
  }, [forms]);

  const currentGroup = useMemo(() => {
    return formDefinition.question_group.find((qg) => qg.id === activeGroup);
  }, [formDefinition, activeGroup]);

  const handleOnSubmitForm = (values) => {
    const results = Object.keys(values)
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
    console.log(results);
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
                      />
                    );
                  })}
                </View>
              )}
            </Formik>
          ) : (
            <QuestionGroupList
              form={formDefinition}
              values={{}} // missing values
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
