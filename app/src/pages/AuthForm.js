import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { Formik, Form, Field } from 'formik';
import { AuthSchema } from '../validations';
const AuthForm = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Login here</Text>
      <Formik
        initialValues={{ passcode: '', accept: false }}
        validationSchema={AuthSchema}
        onSubmit={(values) => {
          console.log(values);
          navigation.navigate('Home');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
          <View>
            <TextInput
              onChangeText={handleChange('passcode')}
              onBlur={handleBlur('passcode')}
              value={values.passcode}
              secureTextEntry={true}
            />
            {errors.passcode && touched.passcode ? <Text>{errors.passcode}</Text> : null}
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
  },
});

export default AuthForm;
