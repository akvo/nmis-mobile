import React from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import { styles } from './styles';
import { FormNavigation } from './support';
import QuestionGroup from './components/QuestionGroup';
import { transformForm, generateValidationSchema } from './lib';

// TODO:: Allow other not supported yet
// TODO:: Repeat group not supported yet
// TODO:: Cascade not supported yet
// TODO:: Geo not supported yet
// TODO:: Validation for dependency question not supported yet

const Webform = ({ forms, initialValues = {} }) => {
  //TODO:: Rename Webform component
  // TRY TO USE FIELD LEVEL VALIDATION
  const formRef = React.useRef();
  const [activeGroup, setActiveGroup] = React.useState(0);

  const formDefinition = React.useMemo(() => {
    return transformForm(forms);
  }, [forms]);

  const validationSchema = React.useMemo(() => {
    return generateValidationSchema(formDefinition);
  }, [formDefinition]);

  return (
    <>
      <ScrollView>
        <BaseLayout.Content>
          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            // validationSchema={validationSchema}
            // validateOnChange={false}
            // validateOnBlur={true}
            onSubmit={(values) => console.log(values)}
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

export default Webform;
