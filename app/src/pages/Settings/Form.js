import React from 'react';
import { View } from 'react-native';
import { ListItem, Switch, Input, Dialog } from '@rneui/themed';
import { BaseLayout } from '../../components';
import { config } from './config';
import { BuildParamsState, UIState, AuthState, UserState } from '../../store';

const SettingsForm = ({ route }) => {
  const [edit, setEdit] = React.useState(null);
  const [list, setList] = React.useState([]);
  const [input, setInput] = React.useState(null);
  const [showDialog, setShowDialog] = React.useState(false);

  const serverURL = BuildParamsState.useState((s) => s.serverURL);
  const { username, password, authenticationCode, useAuthenticationCode } = AuthState.useState(
    (s) => s,
  );
  const { lang, isDarkMode, fontSize } = UIState.useState((s) => s);
  const { syncInterval, syncWifiOnly } = UserState.useState((s) => s);
  const store = {
    AuthState,
    BuildParamsState,
    UIState,
    UserState,
  };
  const settingsState = {
    serverURL,
    username,
    password,
    authenticationCode,
    useAuthenticationCode,
    lang,
    isDarkMode,
    fontSize,
    syncInterval,
    syncWifiOnly,
  };
  const editState = React.useMemo(() => {
    if (edit && edit?.key) {
      const [stateName, stateKey] = edit?.key?.split('.');
      return [store[stateName], stateKey];
    }
    return null;
  }, [edit]);

  const handleEditPress = (id) => {
    setShowDialog(true);
    const findEdit = list.find((item) => item.id === id);
    setEdit(findEdit);
  };

  const handleOKPress = () => {
    setShowDialog(false);
    if (edit && input) {
      const [stateData, stateKey] = editState;
      stateData.update((d) => {
        d[stateKey] = input;
      });
      setEdit(null);
    }
  };
  const handleCancelPress = () => {
    setShowDialog(false);
    setEdit(null);
  };

  const handleOnSwitch = (value, key) => {
    const [stateName, stateKey] = key?.split('.');
    store[stateName].update((s) => {
      s[stateKey] = value;
    });
  };
  const settingsID = React.useMemo(() => {
    return route?.params?.id;
  }, [route]);

  React.useEffect(() => {
    const findConfig = config.find((c) => c?.id === settingsID);
    const fields = findConfig ? findConfig.fields : [];
    setList(fields);
  }, [settingsID]);

  // React.useEffect(() => {
  //   const selectQuery = query.read('config');
  //   conn.tx(db, selectQuery, []).then((res) => {
  //     console.log('res', res);
  //   });
  // }, []);

  const inputTypes = ['text', 'number', 'password', 'date', 'option'];
  const isPassword = edit?.type === 'password' || false;
  return (
    <BaseLayout title={route?.params?.name}>
      <BaseLayout.Content>
        <View>
          {list.map((l, i) =>
            inputTypes.includes(l.type) ? (
              <ListItem key={i} onPress={() => handleEditPress(l.id)} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{l.label}</ListItem.Title>
                  <ListItem.Subtitle>{settingsState[l.name] || l.description}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ) : (
              <ListItem key={i} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{l.label}</ListItem.Title>
                  <ListItem.Subtitle>{l.description}</ListItem.Subtitle>
                </ListItem.Content>
                {l.type === 'switch' && (
                  <Switch
                    value={settingsState[l.name] || false}
                    onValueChange={(value) => handleOnSwitch(value, l.key)}
                  />
                )}
              </ListItem>
            ),
          )}
        </View>
        <Dialog isVisible={showDialog}>
          <Input
            placeholder={edit?.label}
            secureTextEntry={isPassword}
            onChangeText={setInput}
            value={settingsState[edit?.name]}
          />
          <Dialog.Actions>
            <Dialog.Button onPress={handleOKPress}>OK</Dialog.Button>
            <Dialog.Button onPress={handleCancelPress}>Cancel</Dialog.Button>
          </Dialog.Actions>
        </Dialog>
      </BaseLayout.Content>
    </BaseLayout>
  );
};

export default SettingsForm;
