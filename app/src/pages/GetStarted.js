import React, { useState, useEffect, useMemo } from 'react';
import { Text, Button, Input } from '@rneui/themed';
import { CenterLayout, Image } from '../components';
import { BuildParamsState } from '../store';
import { api } from '../lib';
import { crudConfig } from '../database/crud';

const GetStarted = ({ navigation }) => {
  const [currentConfig, setCurrentConfig] = useState({});
  const [IPAddr, setIPAddr] = useState(null);
  const serverURLState = BuildParamsState.useState((s) => s.serverURL);

  const getConfig = async () => {
    const config = await crudConfig.getConfig();
    if (config) {
      setCurrentConfig(config);
    }
  };

  const isServerURLDefined = useMemo(() => {
    return currentConfig?.serverURL && serverURLState;
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

  const titles = ['Get Started', 'collecting data the', 'smart way'];
  return (
    <CenterLayout title={titles}>
      <Image />
      <CenterLayout.Titles items={titles} />
      <Text>Lorem Ipsum dolor sit amet dolor random</Text>
      {!isServerURLDefined && <Input placeholder="Input Server URL" onChangeText={setIPAddr} />}
      <Button title="primary" onPress={goToLogin}>
        Get Started
      </Button>
    </CenterLayout>
  );
};

export default GetStarted;
