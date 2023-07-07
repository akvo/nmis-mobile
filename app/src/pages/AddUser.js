import React, { useState, useRef } from 'react';
import { View, ToastAndroid, Platform } from 'react-native';
import { ListItem, Button, Input, Text } from '@rneui/themed';
import { Formik, ErrorMessage } from 'formik';
import * as Crypto from 'expo-crypto';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';

import { BaseLayout } from '../components';
import { conn, query } from '../database';
import { UserState } from '../store';

db = conn.init;

const AddUser = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const goToUsers = () => {
    navigation.navigate('Users');
  };

  const getUsersCount = async () => {
    const { rows } = await conn.tx(db, query.count('users'));
    return rows._array?.[0]?.count || 0;
  };

  const checkExistingUser = async (name) => {
    const checkQuery = query.read('users', { name });
    const { rows } = await conn.tx(db, checkQuery, [name]);
    return rows.length;
  };

  const handleInsertDB = (data) => {
    const insertQuery = query.insert('users', data);
    conn
      .tx(db, insertQuery)
      .then(({ insertId }) => {
        if (data?.active) {
          UserState.update((s) => {
            s.id = insertId;
          });
        }
        if (Platform.OS === 'android') {
          ToastAndroid.show('Success!', ToastAndroid.SHORT);
        }
        setLoading(false);
        navigation.navigate('Users', { added: { id: insertId } });
      })
      .catch(() => {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Unable to save the data to the database', ToastAndroid.LONG);
        }
        setLoading(false);
      });
  };

  const submitData = async ({ password, name }) => {
    setLoading(true);
    const passwordEncrypted = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      password,
    );
    const numOfRow = await getUsersCount();
    const isActive = numOfRow === 0;
    const exist = await checkExistingUser(name);
    if (exist) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('User already exists', ToastAndroid.SHORT);
      }
      setLoading(false);
    } else {
      const data = {
        name,
        password: passwordEncrypted,
        active: isActive,
      };

      handleInsertDB(data);
      formRef.current.resetForm();
    }
  };
  const initialValues = {
    name: null,
    password: '',
    confirmPassword: null,
  };
  const addSchema = Yup.object().shape({
    name: Yup.string().required('Username is required'),
    password: Yup.string().nullable(),
    confirmPassword: Yup.string().when('password', {
      is: (password) => password && password.length > 0,
      then: (schema) => schema.oneOf([Yup.ref('password')], 'Passwords must match'),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  return (
    <BaseLayout
      title="Create New Profile"
      leftComponent={
        <Button type="clear" onPress={goToUsers} testID="arrow-back-button">
          <Icon name="arrow-back" size={18} />
        </Button>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={addSchema}
        innerRef={formRef}
        onSubmit={async (values) => {
          try {
            await submitData(values);
          } catch (err) {
            throw err;
          } finally {
            formRef.current.setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, values, handleSubmit, isSubmitting }) => (
          <BaseLayout.Content>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>
                  Username <Text color="#ff0000">*</Text>
                </ListItem.Title>
                <Input
                  placeholder={'Username'}
                  onChangeText={(value) => setFieldValue('name', value)}
                  errorMessage={<ErrorMessage name="name" />}
                  value={values.name}
                  name="name"
                  testID="input-name"
                />
              </ListItem.Content>
            </ListItem>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Password</ListItem.Title>
                <Input
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={(value) => setFieldValue('password', value)}
                  value={values.password}
                  errorMessage={<ErrorMessage name="password" />}
                  testID="input-password"
                />
              </ListItem.Content>
            </ListItem>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Confirm Password</ListItem.Title>
                <Input
                  placeholder="Confirm Password"
                  secureTextEntry
                  onChangeText={(value) => setFieldValue('confirmPassword', value)}
                  errorMessage={<ErrorMessage name="confirmPassword" />}
                  value={values.confirmPassword}
                  testID="input-confirm-password"
                />
              </ListItem.Content>
            </ListItem>

            <View
              style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingHorizontal: 16 }}
            >
              <Button
                onPress={handleSubmit}
                loading={loading}
                disabled={isSubmitting}
                testID="button-save"
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </View>
          </BaseLayout.Content>
        )}
      </Formik>
    </BaseLayout>
  );
};

export default AddUser;
