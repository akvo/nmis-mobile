import React, { useState, useEffect, useMemo } from 'react';
import { Text, Button, Input } from '@rneui/themed';
import { CenterLayout, Image } from '../components';
import { BuildParamsState, UIState } from '../store';
import { api, i18n } from '../lib';
import { crudConfig } from '../database/crud';

const GetStarted = ({ navigation }) => {
  const [currentConfig, setCurrentConfig] = useState({});
  const [IPAddr, setIPAddr] = useState(null);
  const serverURLState = BuildParamsState.useState((s) => s.serverURL);
  const activeLang = UIState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);
  console.log(serverURLState, '=======');

  const getConfig = async () => {
    const config = await crudConfig.getConfig();
    if (config) {
      setCurrentConfig(config);
    }
  };

  const isServerURLDefined = useMemo(() => {
    return currentConfig?.serverURL || serverURLState;
  }, [currentConfig?.serverURL, serverURLState]);

  useEffect(() => {
    getConfig();
  }, []);

  const goToLogin = async () => {
    if (IPAddr) {
      BuildParamsState.update((s) => {
        s.serverURL = IPAddr;
      });
      api.setServerURL(IPAddr);
      // save server URL
      await crudConfig.updateConfig({ serverURL: IPAddr });
    }
    setTimeout(() => {
      navigation.navigate('AuthForm');
    }, 100);
  };

  const titles = [trans.getStartedTitle1, trans.getStartedTitle2, trans.getStartedTitle3];
  return (
    <CenterLayout title={titles}>
      <Image />
      <CenterLayout.Titles items={titles} />
      <Text>{trans.getStartedSubTitle}</Text>
      {!isServerURLDefined && (
        <Input placeholder={trans.getStartedInputServer} onChangeText={setIPAddr} />
      )}
      <Button title="primary" onPress={goToLogin}>
        {trans.buttonGetStarted}
      </Button>
    </CenterLayout>
  );
};

export default GetStarted;
