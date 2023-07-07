import React, { useState, useEffect } from 'react';
import { Text, Button, Input } from '@rneui/themed';
import { CenterLayout, Image } from '../components';
import { BuildParamsState } from '../store';
import { api } from '../lib';
import { crudConfig } from '../database/crud';

const serverURLNotDefined = 'http://:8080';

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

  useEffect(() => {
    getConfig();
  }, []);

  const goToLogin = async () => {
    if (IPAddr) {
      const URL = `http://${IPAddr}:8080`;
      api.setServerURL(URL);
      // save server URL
      await crudConfig.updateConfig({ serverURL: URL });
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
      {currentConfig?.serverURL === '' ||
        (serverURLState === serverURLNotDefined && (
          <Input
            keyboardType="numeric"
            placeholder="IP Address (dev mode only)"
            onChangeText={setIPAddr}
          />
        ))}
      <Button title="primary" onPress={goToLogin}>
        Get Started
      </Button>
    </CenterLayout>
  );
};

export default GetStarted;
