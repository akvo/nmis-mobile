import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, Platform, ToastAndroid } from 'react-native';
import { Input, CheckBox, Button, Text, Dialog } from '@rneui/themed';
import { CenterLayout, Image } from '../components';
import { api } from '../lib';
import { AuthState, UserState, UIState } from '../store';
import { crudSessions, crudForms, crudUsers } from '../database/crud';

const ToggleEye = ({ hidden, onPress }) => {
  const iconName = hidden ? 'eye' : 'eye-off';
  return (
    <Button type="clear" onPress={onPress} testID="auth-toggle-eye-button">
      <Icon name={iconName} size={24} />
    </Button>
  );
};

const AuthForm = ({ navigation }) => {
  const isNetworkAvailable = UIState.useState((s) => s.online);
  const [passcode, setPasscode] = React.useState(null);
  const [hidden, setHidden] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const toggleHidden = () => setHidden(!hidden);
  const goTo = (page) => navigation.navigate(page);

  const disableLoginButton = React.useMemo(
    () => !passcode || passcode === '' || !checked,
    [passcode, checked],
  );

  const handleOnPressLogin = () => {
    // check connection
    if (!isNetworkAvailable) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('No connection', ToastAndroid.LONG);
      }
      return false;
    }

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
          const bearerToken = data.syncToken;
          const lastSession = await crudSessions.selectLastSession();
          if (!lastSession && lastSession?.token !== bearerToken) {
            console.info('Saving tokens...');
            api.setToken(bearerToken);
            await crudSessions.addSession({ token: bearerToken, passcode });
          }
          // save forms
          await data.formsUrl.forEach(async (form) => {
            // Fetch form detail
            const formRes = await api.get(form.url);
            console.info('Saving Forms...', form.id);
            await crudForms.addFormsIfNotExist({ ...form, formJSON: formRes?.data });
          });
          // check users exist
          const users = await crudUsers.selectUsers();
          // update auth state
          AuthState.update((s) => {
            s.authenticationCode = passcode;
            s.token = bearerToken;
          });
          if (!users?.length) {
            goTo('AddUser');
            return;
          }
          // update user state
          const user = users?.[users?.length - 1];
          UserState.update((s) => {
            s.id = user.id;
            s.name = user.name;
            s.password = user.password;
          });
          // go to home page (form list)
          goTo('Home');
          return;
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
        {error && (
          <Text style={styles.errorText} testID="auth-error-text">
            {error}
          </Text>
        )}
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
