import React from 'react';
import { View, ToastAndroid } from 'react-native';
import { ListItem, Button, Input } from '@rneui/themed';
import { Formik, ErrorMessage } from 'formik';
import * as Crypto from 'expo-crypto';
import * as Yup from 'yup';

import { BaseLayout, Image } from '../components';
import { conn, query } from '../database';
import { UserState } from '../store';

db = conn.init;

const DEFAULT_UID = 1;

const AddUser = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);
  const { id: userID, name, password } = UserState.useState((s) => s);

  const goToHome = () => {
    navigation.navigate('Home');
  };

  const handleUpdateDB = (id, data) => {
    const updateQuery = query.update('users', { id }, data);
    conn
      .tx(db, updateQuery, [id])
      .then(() => {
        UserState.update((s) => {
          s.id = id;
        });

        ToastAndroid.show('Success!', ToastAndroid.SHORT);
        setLoading(false);
      })
      .catch(() => {
        ToastAndroid.show('Unable to save the data to the database', ToastAndroid.LONG);
        setLoading(false);
      });
  };

  const handleInsertDB = (data) => {
    const insertQuery = query.insert('users', data);
    conn
      .tx(db, insertQuery)
      .then(({ insertId }) => {
        if (insertId) {
          UserState.update((s) => {
            s.id = insertId;
          });
        }
        ToastAndroid.show('Success!', ToastAndroid.SHORT);

        setLoading(false);
      })
      .catch(() => {
        ToastAndroid.show('Unable to save the data to the database', ToastAndroid.LONG);
        setLoading(false);
      });
  };

  const handleSaveData = async () => {
    const passwordEncrypted = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      password,
    );
    const data = {
      name,
      id: DEFAULT_UID,
      password: passwordEncrypted,
    };
    if (userID) {
      handleUpdateDB(userID, data);
    } else {
      handleInsertDB(data);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    try {
      handleSaveData();
    } catch (error) {
      consoe.log('err', error);
      setLoading(false);
      throw error;
    }
  };

  const handleNameChange = (formikChange, value) => {
    formikChange('name')(value);
    UserState.update((s) => {
      s.name = value;
    });
  };

  const handlePasswordChange = (formikChange, value) => {
    formikChange('password')(value);
    UserState.update((s) => {
      s.password = value;
    });
  };

  const initialValues = {
    name,
    password,
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

  React.useEffect(() => {
    const selectQuery = query.read('users', { id: DEFAULT_UID });
    conn
      .tx(db, selectQuery, [DEFAULT_UID])
      .then(({ rows }) => {
        if (rows.length) {
          const userDB = rows._array[0];
          UserState.update((s) => {
            s.id = DEFAULT_UID;
            s.name = userDB?.name;
          });
        }
      })
      .catch(() => {
        ToastAndroid.show('Unable to load profile', ToastAndroid.LONG);
      });
  }, []);

  return (
    <BaseLayout title="Create New Profile">
      <Formik initialValues={initialValues} validationSchema={addSchema} onSubmit={handleSubmit}>
        {(formik) => (
          <BaseLayout.Content>
            <ListItem>
              <ListItem.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image />
              </ListItem.Content>
            </ListItem>

            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Username</ListItem.Title>
                <Input
                  placeholder="Username"
                  onChangeText={(value) => handleNameChange(formik.handleChange, value)}
                  value={name}
                  errorMessage={<ErrorMessage name="name" />}
                />
              </ListItem.Content>
            </ListItem>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Password</ListItem.Title>
                <Input
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={(value) => handlePasswordChange(formik.handleChange, value)}
                  value={password}
                  errorMessage={<ErrorMessage name="password" />}
                />
              </ListItem.Content>
            </ListItem>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Confirm Password</ListItem.Title>
                <Input
                  placeholder="Confirm Password"
                  secureTextEntry
                  onChangeText={formik.handleChange('confirmPassword')}
                  value={formik.confirmPassword}
                  errorMessage={<ErrorMessage name="confirmPassword" />}
                />
              </ListItem.Content>
            </ListItem>

            <View
              style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingHorizontal: 16 }}
            >
              <Button onPress={formik.handleSubmit} loading={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
              {userID && <Button title="Go to Dashboard" type="outline" onPress={goToHome} />}
            </View>
          </BaseLayout.Content>
        )}
      </Formik>
    </BaseLayout>
  );
};

export default AddUser;
