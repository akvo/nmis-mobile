import React from 'react';
import { View } from 'react-native';
import { ListItem, Switch } from '@rneui/themed';
import { BaseLayout } from '../../components';
import { config } from './config';
import { BuildParamsState, UIState, AuthState, UserState } from '../../store';
import { conn, query } from '../../database';
import DialogForm from './DialogForm';

const db = conn.init;

const SettingsForm = ({ route }) => {
  const [edit, setEdit] = React.useState(null);
  const [list, setList] = React.useState([]);
  const [showDialog, setShowDialog] = React.useState(false);

  const { serverURL, appVersion } = BuildParamsState.useState((s) => s);
  const { authenticationCode, useAuthenticationCode } = AuthState.useState((s) => s);
  const { lang, isDarkMode, fontSize } = UIState.useState((s) => s);
  const { syncInterval, syncWifiOnly } = UserState.useState((s) => s);
  const store = {
    AuthState,
    BuildParamsState,
    UIState,
    UserState,
  };
  const [settingsState, setSettingsState] = React.useState({
    serverURL,
    authenticationCode,
    useAuthenticationCode,
    lang,
    isDarkMode,
    fontSize,
    syncInterval,
    syncWifiOnly,
  });

  const editState = React.useMemo(() => {
    if (edit && edit?.key) {
      const [stateName, stateKey] = edit?.key?.split('.');
      return [store[stateName], stateKey];
    }
    return null;
  }, [edit]);

  const handleEditPress = (id) => {
    const findEdit = list.find((item) => item.id === id);
    if (findEdit) {
      setEdit({
        ...findEdit,
        value: settingsState[findEdit?.name] || null,
      });
      setShowDialog(true);
    }
  };

  const handleUpdateOnDB = (field, value) => {
    const dbFields = [
      'apVersion',
      'authenticationCode',
      'serverURL',
      'syncInterval',
      'syncWifiOnly',
      'lang',
    ];
    if (dbFields.includes(field)) {
      const id = 1;
      const updateQuery = query.update('config', { id }, { [field]: value });
      conn.tx(db, updateQuery, [id]);
    }
  };

  const handleOKPress = (inputValue) => {
    setShowDialog(false);
    if (edit && inputValue) {
      const [stateData, stateKey] = editState;
      stateData.update((d) => {
        d[stateKey] = inputValue;
      });
      setSettingsState({
        ...settingsState,
        [stateKey]: inputValue,
      });
      handleUpdateOnDB(stateKey, inputValue);
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
    setSettingsState({
      ...settingsState,
      [stateKey]: value,
    });
    handleUpdateOnDB(stateKey, value);
  };

  const handleCreateNewConfig = () => {
    const insertQuery = query.insert('config', {
      id: 1,
      appVersion,
      authenticationCode: 'testing',
      serverURL,
      syncInterval,
      syncWifiOnly,
      lang,
    });
    conn.tx(db, insertQuery, []);
  };

  const settingsID = React.useMemo(() => {
    return route?.params?.id;
  }, [route]);

  React.useEffect(() => {
    const findConfig = config.find((c) => c?.id === settingsID);
    const fields = findConfig ? findConfig.fields : [];
    setList(fields);
  }, [settingsID]);

  React.useEffect(() => {
    const selectQuery = query.read('config', { id: 1 });
    conn.tx(db, selectQuery, [1]).then(({ rows }) => {
      if (rows.length) {
        const configRows = rows._array[0];
        setSettingsState({
          ...settingsState,
          ...configRows,
        });
      } else {
        handleCreateNewConfig();
      }
    });
  }, []);
  return (
    <BaseLayout title={route?.params?.name}>
      <BaseLayout.Content>
        <View>
          {list.map((l, i) => {
            const switchValue =
              l.type === 'switch' && (settingsState[l.name] || false) ? true : false;
            const listProps = l.type === 'switch' ? {} : { onPress: () => handleEditPress(l.id) };
            const subtitle =
              l.type === 'switch' ? l.description : settingsState[l.name] || l.description;
            return (
              <ListItem key={i} {...listProps} testID={`settings-form-item-${i}`} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{l.label}</ListItem.Title>
                  <ListItem.Subtitle>{subtitle}</ListItem.Subtitle>
                </ListItem.Content>
                {l.type === 'switch' && (
                  <Switch
                    onValueChange={(value) => handleOnSwitch(value, l.key)}
                    value={switchValue}
                    testID={`settings-form-switch-${i}`}
                  />
                )}
              </ListItem>
            );
          })}
        </View>
        <DialogForm
          onOk={handleOKPress}
          onCancel={handleCancelPress}
          showDialog={showDialog}
          edit={edit}
        />
      </BaseLayout.Content>
    </BaseLayout>
  );
};

export default SettingsForm;
