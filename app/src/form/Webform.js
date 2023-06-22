import React from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Text, Input, CheckBox, Button } from '@rneui/themed';
import { Formik } from 'formik';
import { styles } from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { FormNavigation } from './support';
import { TypeImage } from './fields';

const FieldLabel = ({ label = '' }) => <Text style={styles.fieldLabel}>{label}</Text>;

const Webform = ({ navigation, route }) => {
  const now = new Date();
  const formRef = React.useRef();
  const [showDatepicker, setShowDatePicker] = React.useState(false);

  const goBack = () => {
    navigation.navigate('FormAction', { ...route?.params });
  };

  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <ScrollView>
        <BaseLayout.Content>
          <Formik innerRef={formRef} initialValues={{}} onSubmit={(values) => console.log(values)}>
            {({ handleChange, handleSubmit, setFieldValue, values }) => (
              <View style={styles.formContainer}>
                {/* Text */}
                <>
                  <FieldLabel label="Name" />
                  <Input onChangeText={handleChange('name')} value={values.name} />
                </>
                {/* DatePicker */}
                <>
                  <FieldLabel label="Birth Date" />
                  <Input
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
                </>
                {/* Number */}
                <>
                  <FieldLabel label="Age" />
                  <Input
                    keyboardType="numeric"
                    onChangeText={handleChange('age')}
                    value={values.age}
                  />
                </>
                {/* Radio */}
                <>
                  <FieldLabel label="Gender" />
                  <CheckBox
                    checked={values.gender === 'male'}
                    onPress={() => setFieldValue('gender', 'male')}
                    title="Male"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                  <CheckBox
                    checked={values.gender === 'female'}
                    onPress={() => setFieldValue('gender', 'female')}
                    title="Female"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                </>
                {/* Single Select Dropdown */}
                <>
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
                </>
                {/* Checkbox */}
                <>
                  <FieldLabel label="Hobby" />
                  {['Reading', 'Traveling', 'Programming'].map((val, ival) => (
                    <CheckBox
                      key={ival}
                      checked={values.hobby?.[ival] === val}
                      onPress={() => {
                        values.hobby?.[ival] === val
                          ? setFieldValue(`hobby.${ival}`, null)
                          : setFieldValue(`hobby.${ival}`, val);
                      }}
                      title={val}
                    />
                  ))}
                </>
                {/* Multiple Select Dropdown */}
                <>
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
                </>
                {/* Image/File Input */}
                <>
                  <FieldLabel label="Image" />
                  <TypeImage />
                </>
                {/* TextArea */}
                <>
                  <FieldLabel label="Comment" />
                  <Input
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={handleChange('comment')}
                    value={values.comment}
                  />
                </>
                {/* <Button ref={submitButtonRef}  title="Submit" /> */}
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
        />
      </View>
    </BaseLayout>
  );
};

export default Webform;
