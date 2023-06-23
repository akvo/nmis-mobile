import React from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Input, CheckBox } from '@rneui/themed';
import { Formik } from 'formik';
import { styles } from './styles';
import { MultiSelect } from 'react-native-element-dropdown';
import { FieldGroupHeader, FieldLabel, FormNavigation } from './support';
import { TypeImage, TypeInput, TypeDate, TypeOption } from './fields';

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

const Webform = ({ navigation, route, initialValues = fakeInitialValues }) => {
  const formRef = React.useRef();
  const [activeGroup, setActiveGroup] = React.useState(0);

  const goBack = () => {
    navigation.navigate('FormAction', { ...route?.params });
  };

  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <ScrollView>
        <BaseLayout.Content>
          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            onSubmit={(values) => console.log(values)}
          >
            {({ handleChange, setFieldValue, values }) => (
              <View style={styles.formContainer}>
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
                    <View style={styles.questionContainer}>
                      <FieldLabel label="Age" />
                      <Input
                        inputContainerStyle={styles.inputFieldContainer}
                        keyboardType="numeric"
                        onChangeText={handleChange('age')}
                        value={values.age}
                      />
                    </View>
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
                    <View style={styles.questionContainer}>
                      <FieldLabel label="Hobby" />
                      {['Reading', 'Traveling', 'Programming'].map((val, ival) => (
                        <CheckBox
                          containerStyle={styles.radioFieldContainer}
                          textStyle={styles.radioFieldText}
                          key={ival}
                          checked={values.hobby?.includes(val)}
                          onPress={() => {
                            values.hobby?.includes(val)
                              ? setFieldValue(`hobby.${ival}`, null)
                              : setFieldValue(`hobby.${ival}`, val);
                          }}
                          title={val}
                        />
                      ))}
                    </View>
                    {/* Multiple Select Dropdown */}
                    <View style={styles.questionContainer}>
                      <FieldLabel label="Favorite Foods" />
                      <MultiSelect
                        style={[styles.dropdownField]}
                        selectedStyle={styles.dropdownSelectedList}
                        data={[
                          { label: 'Fried Rice', value: 'Fried Rice' },
                          { label: 'Roasted Chicken', value: 'Roasted Chicken' },
                          { label: 'Rendang', value: 'Rendang' },
                          { label: 'Pork Ribs', value: 'Pork Ribs' },
                          { label: 'KFC', value: 'KFC' },
                          { label: 'McD', value: 'McD' },
                        ]}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        searchPlaceholder="Search..."
                        value={values.foods || []}
                        onChange={(value) => {
                          setFieldValue('foods', value);
                        }}
                      />
                    </View>
                    {/* Image/File Input */}
                    <View style={styles.questionContainer}>
                      <TypeImage onChange={setFieldValue} />
                    </View>
                    {/* TextArea */}
                    <View style={styles.questionContainer}>
                      <FieldLabel label="Comment" />
                      <Input
                        inputContainerStyle={styles.inputFieldContainer}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={handleChange('comment')}
                        value={values.comment}
                      />
                    </View>
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
    </BaseLayout>
  );
};

export default Webform;
