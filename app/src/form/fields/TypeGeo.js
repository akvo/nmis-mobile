import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import { FieldLabel } from '../support';
import { styles } from '../styles';
import * as Location from 'expo-location';

const TypeGeo = ({ onChange, values, keyform, id, name }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigation = useNavigation();

  const handleOpenMapPress = () => {
    navigation.navigate('MapView');
  };

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

  useEffect(() => {
    if (text && !values?.[id]) {
      onChange(text);
    }
  }, [values, id, text]);

  return (
    <View>
      <FieldLabel keyform={keyform} name={name} />
      <View style={styles?.inputGeoContainer}>
        <Text key={id} style={styles.inputFieldContainer}>
          {text}
        </Text>
        <Button type="outline" onPress={handleOpenMapPress}>
          Open Map
        </Button>
      </View>
    </View>
  );
};

export default TypeGeo;
