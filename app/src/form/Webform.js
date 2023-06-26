import React from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import { styles } from './styles';
import { FieldGroupHeader, FormNavigation } from './support';
import {
  TypeImage,
  TypeInput,
  TypeDate,
  TypeOption,
  TypeMultipleOption,
  TypeText,
  TypeNumber,
} from './fields';
import QuestionGroup from './components/QuestionGroup';

const fakeInitialValues = {
  name: 'John Doe',
  birthDate: new Date('01-01-1991'),
  age: '32',
  gender: 'male',
  education: 'Bachelor',
  hobby: ['Traveling'],
  foods: ['Fried Rice', 'Rendang'],
  comment: 'Lorem ipsum...',
};

const Webform = ({ forms, initialValues = fakeInitialValues }) => {
  const formRef = React.useRef();
  const [activeGroup, setActiveGroup] = React.useState(0);

  const formDefinition = React.useMemo(() => {
    return forms;
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
                  return <QuestionGroup index={groupIndex} group={group} />;
                })}

                {/* Group 1 */}
                {activeGroup === 0 && (
                  <View style={styles.questionGroupContainer}>
                    <FieldGroupHeader
                      name="Group 1"
                      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dapibus."
                    />
                    {/* Text */}
                    <TypeInput onChange={handleChange} values={values} id="name" name="Name" />
                    {/* DatePicker */}
                    <TypeDate
                      onChange={setFieldValue}
                      values={values}
                      id="birthDate"
                      name="Birth Date"
                    />
                    {/* Number */}
                    <TypeNumber onChange={handleChange} values={values} id="age" name="Age" />
                    {/* Radio */}
                    <TypeOption
                      onChange={setFieldValue}
                      values={values}
                      id="gender"
                      name="Gender"
                      option={[
                        { label: 'Male', name: 'male' },
                        { label: 'Female', name: 'female' },
                      ]}
                    />
                    {/* Single Select Dropdown */}
                    <TypeOption
                      onChange={setFieldValue}
                      values={values}
                      id="education"
                      name="Last Education"
                      option={[
                        { label: 'Senior High School', name: 'Senior High School' },
                        { label: 'Bachelor', name: 'Bachelor' },
                        { label: 'Master', name: 'Master' },
                        { label: 'Doctor', name: 'Doctor' },
                      ]}
                    />
                  </View>
                )}

                {/* Group 2 */}
                {activeGroup === 1 && (
                  <View style={styles.questionGroupContainer}>
                    <FieldGroupHeader
                      name="Group 2"
                      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dapibus."
                    />
                    {/* Checkbox */}
                    <TypeMultipleOption
                      onChange={setFieldValue}
                      values={values}
                      id="hobby"
                      name="Hobby"
                      option={[
                        { label: 'Reading', name: 'Reading' },
                        { label: 'Traveling', name: 'Traveling' },
                        { label: 'Programming', name: 'Programming' },
                      ]}
                    />
                    {/* Multiple Select Dropdown */}
                    <TypeMultipleOption
                      onChange={setFieldValue}
                      values={values}
                      id="foods"
                      name="Favorite Foods"
                      option={[
                        { label: 'Fried Rice', name: 'Fried Rice' },
                        { label: 'Roasted Chicken', name: 'Roasted Chicken' },
                        { label: 'Rendang', name: 'Rendang' },
                        { label: 'Pork Ribs', name: 'Pork Ribs' },
                        { label: 'KFC', name: 'KFC' },
                        { label: 'McD', name: 'McD' },
                      ]}
                    />
                    {/* Image/File Input */}
                    <TypeImage onChange={setFieldValue} id="image" name="Image" />
                    {/* TextArea */}
                    <TypeText onChange={handleChange} values={values} id="comment" name="Comment" />
                  </View>
                )}
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
        />
      </View>
    </>
  );
};

export default Webform;
