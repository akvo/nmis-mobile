import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet } from 'react-native';
import { Input, CheckBox, Button, Text, Dialog } from '@rneui/themed';
import { CenterLayout, Image } from '../components';
import { api } from '../lib';
import { AuthState } from '../store';
import { conn, query } from '../database';

const db = conn.init;

const ToggleEye = ({ hidden, onPress }) => {
  const iconName = hidden ? 'eye' : 'eye-off';
  return (
    <Button type="clear" onPress={onPress} testID="auth-toggle-eye-buton">
      <Icon name={iconName} size={24} />
    </Button>
  );
};

const AuthForm = ({ navigation }) => {
  const [passcode, setPasscode] = React.useState(null);
  const [hidden, setHidden] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const toggleHidden = () => setHidden(!hidden);
  const goToHome = () => navigation.navigate('Home');

  const disableLoginButton = React.useMemo(
    () => !passcode || passcode === '' || !checked,
    [passcode, checked],
  );

  const handleOnPressLogin = () => {
    setError(null);
    setLoading(true);
    const data = new FormData();
    data.append('code', passcode);
    api
      .post('/auth', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(async (res) => {
        try {
          const { data } = res;
          // save session
          const token = data.syncToken;
          const checkTokenExist = await conn.tx(db, query.read('sessions', { token }, [token]));
          if (!checkTokenExist?.rows?.length) {
            await conn.tx(db, query.insert('sessions', { token: data.syncToken }), []);
          }
          // save forms
          await data.formsUrl.map(({ id: formId, url, version }) => {
            const table = 'forms';
            // check exist
            conn
              .tx(db, query.read(table, { formId, version }), [formId, version])
              .then(async (res) => {
                const { rows } = res;
                if (rows.length) {
                  return false;
                }
                // Fetch form detail
                const formRes = await api.get(url);
                // insert
                const insertQuery = query.insert(table, {
                  formId: formId,
                  version: version,
                  latest: 1,
                  name: formRes?.data?.name || null,
                  json: formRes?.data ? formRes?.data : null,
                  createdAt: new Date().toISOString(),
                });
                console.info('Saving Forms...', formId);
                return await conn.tx(db, insertQuery, []);
              });
          });
          // update state
          AuthState.update((s) => {
            s.authenticationCode = passcode;
          });
          // go to home page
          goToHome();
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        setError(err?.message);
      })
      .finally(() => setLoading(false));
  };

  const titles = ['Use the Enumerator ID', 'provided to you by your', 'project admin'];
  return (
    <CenterLayout>
      <Image />
      <CenterLayout.Titles items={titles} />
      <View style={styles.container}>
        <Input
          placeholder="Enumerator ID"
          secureTextEntry={hidden}
          rightIcon={<ToggleEye hidden={hidden} onPress={toggleHidden} />}
          testID="auth-password-field"
          autoFocus
          value={passcode}
          onChangeText={setPasscode}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <CheckBox
          title="I accept the Terms or Conditions"
          checked={checked}
          onPress={() => setChecked(!checked)}
          containerStyle={styles.checkbox}
          textStyle={styles.text}
          testID="auth-checkbox-field"
          center
        />
      </View>
      <Button
        title="primary"
        disabled={disableLoginButton || loading}
        onPress={handleOnPressLogin}
        testID="auth-login-button"
      >
        LOG IN
      </Button>
      {/* Loading dialog */}
      <Dialog isVisible={loading} style={styles.dialogLoadingContainer}>
        <Dialog.Loading />
        <Text style={styles.dialogLoadingText}>Fetching data</Text>
      </Dialog>
    </CenterLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  checkbox: {
    backgroundColor: '#f9fafb',
  },
  text: {
    marginLeft: 8,
  },
  errorText: { color: 'red', fontStyle: 'italic', marginHorizontal: 10, marginTop: -8 },
  dialogLoadingContainer: {
    flex: 1,
  },
  dialogLoadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AuthForm;
