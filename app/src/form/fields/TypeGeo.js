import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import { MapState } from '../../store';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { loc } from '../../lib';

const TypeGeo = ({
  onChange,
  values,
  keyform,
  id,
  name,
  lang,
  tooltip,
  translations,
  required,
  requiredSign,
}) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { latitude, longitude } = MapState.useState((s) => s);

  const navigation = useNavigation();

  const handleOpenMapPress = () => {
    const geoVal = values?.[id];
    let params = location?.coords;
    if (geoVal) {
      const [lat, lng] = geoVal?.split('|');
      params = { latitude: lat, longitude: lng };
    }
    navigation.navigate('MapView', params);
  };
  useEffect(() => {
    try {
      if (location === null) {
        loc.getCurrentLocation(
          (res) => {
            setLocation(res);
          },
          (err) => {
            setLocation({});
            setErrorMsg(err.message);
          },
        );
      }
    } catch {
      setLocation({});
    }
  }, [location]);

  const text = useMemo(() => {
    if (errorMsg) {
      return errorMsg;
    }
    if (location?.coords) {
      const { latitude: lat, longitude: lng } = location?.coords;
      const coordsMap = `${latitude}|${longitude}`;
      const coordsLoc = `${lat}|${lng}`;
      return latitude && longitude ? coordsMap : coordsLoc;
    }
    return 'Waiting..';
  }, [errorMsg, location, latitude, longitude]);

  useEffect(() => {
    if (!onChange) {
      return;
    }
    if ((text && !values?.[id]) || (values?.[id] && values[id] !== text)) {
      onChange(id, text);
    }
  }, [values, id, text]);

  const [latText, lngText] = text?.split('|');
  return (
    <View>
      <FieldLabel
        keyform={keyform}
        name={name}
        lang={lang}
        tooltip={tooltip}
        translations={translations}
        requiredSign={required ? requiredSign : null}
      />
      <View style={styles.inputGeoContainer}>
        {latText && lngText ? (
          <View>
            <Text testID="text-lat">Latitude: {latText}</Text>
            <Text testID="text-lng">Longitude: {lngText}</Text>
          </View>
        ) : (
          <Text style={styles.inputFieldContainer} testID="text-waiting">
            {text}
          </Text>
        )}
        <Button type="outline" onPress={handleOpenMapPress} testID="button-open-map">
          Open Map
        </Button>
      </View>
    </View>
  );
};

export default TypeGeo;
