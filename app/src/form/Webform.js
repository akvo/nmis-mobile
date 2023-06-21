import React from 'react';
import { BaseLayout } from '../components';
import { ScrollView } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { Formik } from 'formik';

const Webform = ({ navigation, route }) => {
  const goBack = () => {
    navigation.navigate('FormAction', { ...route?.params });
  };

  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <BaseLayout.Content>
        <Formik initialValues={{}} onSubmit={(values) => console.log(values)}>
          {({ handleChange, handleSubmit, values }) => (
            <ScrollView>
              {/* Text */}
              <Input label="Name" onChangeText={handleChange('name')} value={values.name} />
              {/* Number */}
              <Input
                label="Age"
                keyboardType="numeric"
                onChangeText={handleChange('age')}
                value={values.age}
              />
              {/* TextArea */}
              <Input
                label="Comment"
                multiline={true}
                numberOfLines={4}
                onChangeText={handleChange('comment')}
                value={values.comment}
              />
              <Button onPress={handleSubmit} title="Submit" />
            </ScrollView>
          )}
        </Formik>
      </BaseLayout.Content>
    </BaseLayout>
  );
};

export default Webform;
