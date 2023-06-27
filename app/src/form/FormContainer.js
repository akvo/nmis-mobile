import React from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import { styles } from './styles';
import { FormNavigation } from './support';
import QuestionGroup from './components/QuestionGroup';
import { transformForm } from './lib';

// TODO:: Allow other not supported yet
// TODO:: Repeat group not supported yet
// TODO:: Cascade not supported yet
// TODO:: Geo not supported yet

const FormContainer = ({ forms, initialValues = {} }) => {
  const formRef = React.useRef();
  const [activeGroup, setActiveGroup] = React.useState(0);

  const formDefinition = React.useMemo(() => {
    return transformForm(forms);
  }, [forms]);

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
          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            onSubmit={handleOnSubmitForm}
            validateOnBlur={true}
            validateOnChange={true}
          >
            {({ setFieldValue, values }) => (
              <View style={styles.formContainer}>
                {formDefinition?.question_group?.map((group, groupIndex) => {
                  if (activeGroup !== groupIndex) {
                    return '';
                  }
                  return (
                    <QuestionGroup
                      key={`group-${groupIndex}`}
                      index={groupIndex}
                      group={group}
                      setFieldValue={setFieldValue}
                      values={values}
                    />
                  );
                })}
              </View>
            )}
          </Formik>
        </BaseLayout.Content>
      </ScrollView>
      <View>
        <FormNavigation
          onSubmit={() => {
            if (formRef.current) {
              formRef.current.handleSubmit();
            }
          }}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
          totalGroup={formDefinition?.question_group?.length || 0}
        />
      </View>
    </>
  );
};

export default FormContainer;
