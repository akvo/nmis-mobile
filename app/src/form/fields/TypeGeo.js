import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import * as Location from 'expo-location';

const TypeGeo = ({ keyform, id, name }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const text = useMemo(() => {
    if (errorMsg) {
      return errorMsg;
    }
    if (location) {
      const { latitude, longitude } = location?.coords || {};
      return `${latitude}|${longitude}`;
    }
    return 'Waiting..';
  }, [errorMsg, location]);
  /**
   * TODO Map preview
   */

  return (
    <View>
      <FieldLabel keyform={keyform} name={name} />
      <Text key={id} style={styles.inputFieldContainer}>
        {text}
      </Text>
    </View>
  );
};

export default TypeGeo;
