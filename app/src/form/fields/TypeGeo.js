import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';

import { MapState, UIState } from '../../store';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { loc } from '../../lib';

const TypeGeo = ({ onChange, values, keyform, id, name, tooltip, required, requiredSign }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { latitude, longitude } = MapState.useState((s) => s);
  const isOnline = UIState.useState((s) => s.online);

  const navigation = useNavigation();
  const route = useRoute();

  const handleOpenMapPress = () => {
    const geoVal = values?.[id];
    const params =
      geoVal?.lat && geoVal?.lng
        ? { latitude: geoVal.lat, longitude: geoVal.lng }
        : location?.coords;

    navigation.navigate('MapView', { ...route?.params, ...params });
  };
  useEffect(() => {
    if (location === null) {
      loc.getCurrentLocation(
        (res) => {
          setLocation(res);
          const { latitude: lat, longitude: lng } = res?.coords || {};
          onChange(id, { lat, lng });
        },
        (err) => {
          setLocation({});
          onChange(id, {});
          setErrorMsg(err.message);
        },
      );
    }
  }, [location]);

  useEffect(() => {
    /**
     * Update from leaflet
     */
    if (
      latitude &&
      longitude &&
      values?.[id]?.lat !== latitude &&
      values?.[id]?.lng !== longitude
    ) {
      onChange(id, { lat: latitude, lng: longitude });
    }
    /**
     * Update from current location
     */
    if (
      !latitude &&
      !longitude &&
      location?.coords &&
      values?.[id]?.lat !== location?.coords?.latitude &&
      values?.[id]?.lng !== location?.coords?.longitude
    ) {
      onChange(id, { lat: location.coords.latitude, lng: location.coords.longitude });
    }
  }, [latitude, longitude, values, id, location]);

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

  const [latText, lngText] = text?.split('|');
  return (
    <View>
      <FieldLabel
        keyform={keyform}
        name={name}
        tooltip={tooltip}
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
        {isOnline && (
          <Button type="outline" onPress={handleOpenMapPress} testID="button-open-map">
            Open Map
          </Button>
        )}
      </View>
    </View>
  );
};

export default TypeGeo;
