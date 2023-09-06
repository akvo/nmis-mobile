import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Asset } from 'expo-asset';
import { View, StyleSheet, Platform, ToastAndroid } from 'react-native';
import { Input, Button, Text, Dialog } from '@rneui/themed';
import { CenterLayout, Image } from '../components';
import { api, cascades, i18n } from '../lib';
import { AuthState, UserState, UIState } from '../store';
import defaultBuildParams from '../build.js';
import { crudSessions, crudForms, crudUsers, crudConfig } from '../database/crud';

const AuthByPassForm = ({ navigation }) => {
  const logo = Asset.fromModule(require('../assets/icon.png')).uri;
  const { online: isNetworkAvailable, lang: activeLang } = UIState.useState((s) => s);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const trans = i18n.text(activeLang);

  const goTo = (page) => navigation.navigate(page);

  useEffect(() => {
    if (isNetworkAvailable && loading) {
      setError(null);
      api
        .get('/forms')
        .then(async (res) => {
          try {
            const { data } = res;
            // save session
            const bearerToken = 'NO TOKEN';
            const lastSession = await crudSessions.selectLastSession();
            if (!lastSession && lastSession?.token !== bearerToken) {
              console.info('Saving tokens...');
              await crudSessions.addSession({ token: bearerToken, passcode: 'NO PASSCODE' });
            }
            await cascades.createSqliteDir();
            // save forms
            await data.formsUrl.forEach(async (form) => {
              // Fetch form detail
              const formRes = await api.get(form.url);
              const savedForm = await crudForms.addForm({ ...form, formJSON: formRes?.data });
              console.info('Saved Forms...', form.id, savedForm);

              // download cascades files
              if (formRes?.data?.cascades?.length) {
                formRes.data.cascades.forEach((cascadeFile) => {
                  const downloadUrl = api.getConfig().baseURL + cascadeFile;
                  cascades.download(downloadUrl, cascadeFile);
                });
              }
            });
            // check users exist
            const activeUser = await crudUsers.getActiveUser();
            // update auth state
            AuthState.update((s) => {
              s.authenticationCode = 'NO PASSCODE';
              s.token = bearerToken;
            });
            if (!activeUser || !activeUser?.id) {
              goTo('AddUser');
            } else {
              UserState.update((s) => {
                s.id = activeUser.id;
                s.name = activeUser.name;
                s.password = activeUser.password;
              });
              goTo('Home');
            }
          } catch (err) {
            console.error(err);
          }
        })
        .catch((err) => {
          const { status: errStatus } = err?.response;
          if ([400, 401].includes(errStatus)) {
            setError(trans.authErrorPasscode);
          } else {
            setError(err?.message);
          }
        })
        .finally(() => setLoading(false));
    } else {
      if (Platform.OS === 'android') {
        ToastAndroid.show(trans.authErrorNoConn, ToastAndroid.LONG);
      }
    }
  }, [isNetworkAvailable, loading]);

  return (
    <CenterLayout>
      <Image src={logo ? logo : null} />
      <View>
        <Dialog.Loading />
        <Text style={styles.dialogLoadingText}>{trans.fetchingData}</Text>
      </View>
    </CenterLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  text: {
    marginLeft: 8,
  },
  dialogLoadingContainer: {
    flex: 1,
  },
  dialogLoadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AuthByPassForm;
