import React from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Input, CheckBox } from '@rneui/themed';
import { Formik } from 'formik';
import { styles } from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { FieldGroupHeader, FieldLabel, FormNavigation } from './support';
import { TypeImage } from './fields';

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
  const now = new Date();
  const formRef = React.useRef();
  const [activeGroup, setActiveGroup] = React.useState(0);
  const [showDatepicker, setShowDatePicker] = React.useState(false);

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
                    <View style={styles.questionContainer}>
                      <FieldLabel label="Name" />
                      <Input
                        inputContainerStyle={styles.inputFieldContainer}
                        onChangeText={handleChange('name')}
                        value={values.name}
                      />
                    </View>
                    {/* DatePicker */}
                    <View style={styles.questionContainer}>
                      <FieldLabel label="Birth Date" />
                      <Input
                        inputContainerStyle={styles.inputFieldContainer}
                        onPressIn={() => setShowDatePicker(true)}
                        showSoftInputOnFocus={false}
                        value={values.birthDate?.toLocaleDateString()}
                      />
                      {showDatepicker && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={values.birthDate || now}
                          mode="date"
                          onChange={({ nativeEvent: val }) => {
                            setShowDatePicker(false);
                            setFieldValue('birthDate', new Date(val.timestamp));
                          }}
                        />
                      )}
                    </View>
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
                    <View style={styles.questionContainer}>
                      <FieldLabel label="Gender" />
                      <CheckBox
                        containerStyle={styles.radioFieldContainer}
                        textStyle={styles.radioFieldText}
                        checked={values.gender === 'male'}
                        onPress={() => setFieldValue('gender', 'male')}
                        title="Male"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                      />
                      <CheckBox
                        containerStyle={styles.radioFieldContainer}
                        textStyle={styles.radioFieldText}
                        checked={values.gender === 'female'}
                        onPress={() => setFieldValue('gender', 'female')}
                        title="Female"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                      />
                    </View>
                    {/* Single Select Dropdown */}
                    <View style={styles.questionContainer}>
                      <FieldLabel label="Last Education" />
                      <Dropdown
                        style={[styles.dropdownField]}
                        data={[
                          { label: 'Senior High School', value: 'Senior High School' },
                          { label: 'Bachelor', value: 'Bachelor' },
                          { label: 'Master', value: 'Master' },
                          { label: 'Doctor', value: 'Doctor' },
                        ]}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        searchPlaceholder="Search..."
                        value={values.education || []}
                        onChange={({ value }) => {
                          setFieldValue('education', value);
                        }}
                      />
                    </View>
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
