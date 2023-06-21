import React from 'react';
import { BaseLayout } from '../components';
import { ScrollView, View } from 'react-native';
import { Text, Input, CheckBox, Button } from '@rneui/themed';
import { Formik } from 'formik';
import { styles } from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';

const FieldLabel = ({ label = '' }) => <Text style={styles.fieldLabel}>{label}</Text>;

const Webform = ({ navigation, route }) => {
  const now = new Date();
  const [showDatepicker, setShowDatePicker] = React.useState(false);

  const goBack = () => {
    navigation.navigate('FormAction', { ...route?.params });
  };

  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <ScrollView>
        <BaseLayout.Content>
          <Formik initialValues={{}} onSubmit={(values) => console.log(values)}>
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
                <Button onPress={handleSubmit} title="Submit" />
              </View>
            )}
          </Formik>
        </BaseLayout.Content>
      </ScrollView>
    </BaseLayout>
  );
};

export default Webform;
