import React from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import { styles } from './styles';
import { FormNavigation } from './support';
import QuestionGroup from './components/QuestionGroup';
import { transformForm } from './lib';

const Webform = ({ forms, initialValues = {} }) => {
  const formRef = React.useRef();
  const [activeGroup, setActiveGroup] = React.useState(0);

  const formDefinition = React.useMemo(() => {
    return transformForm(forms);
  }, [forms]);

  return (
    <>
      <ScrollView>
        <BaseLayout.Content>
          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            onSubmit={(values) => console.log(values)}
          >
            {({ handleChange, setFieldValue, values }) => (
              <View style={styles.formContainer}>
                {formDefinition?.question_group?.map((group, groupIndex) => {
                  if (activeGroup !== groupIndex) {
                    return '';
                  }
                  return (
                    <QuestionGroup
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
