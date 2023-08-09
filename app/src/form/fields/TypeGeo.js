import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';

import { UIState, FormState } from '../../store';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { loc, i18n } from '../../lib';

const TypeGeo = ({ onChange, values, keyform, id, name, tooltip, required, requiredSign }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState({ current: false, map: false });
  const currentValues = FormState.useState((s) => s.currentValues);
  const [latitude, longitude] = currentValues?.[id] || [];
  const isOnline = UIState.useState((s) => s.online);
  const activeLang = FormState.useState((s) => s.lang);

  const trans = i18n.text(activeLang);

  const navigation = useNavigation();
  const route = useRoute();
  const requiredValue = required ? requiredSign : null;

  const handleGetCurrLocation = async (openMap = false) => {
    const loadingKey = openMap ? 'map' : 'current';
    setLoading({
      ...loading,
      [loadingKey]: true,
    });
    await loc.getCurrentLocation(
      ({ coords }) => {
        if (coords) {
          const { latitude: lat, longitude: lng } = coords;
          onChange(id, [lat, lng]);
          if (openMap) {
            const params = { latitude: lat, longitude: lng, id };
            navigation.navigate('MapView', { ...route?.params, ...params });
          }
        }
        setLoading({
          ...loading,
          [loadingKey]: false,
        });
      },
      ({ message }) => {
        setLoading({
          ...loading,
          [loadingKey]: false,
        });
        setErrorMsg(message);
      },
    );
  };

  return (
    <View>
      <FieldLabel keyform={keyform} name={name} tooltip={tooltip} requiredSign={requiredValue} />
      <View style={styles.inputGeoContainer}>
        {errorMsg ? (
          <Text testID="text-error">{errorMsg}</Text>
        ) : (
          <View>
            <Text testID="text-lat">
              {trans.latitude}: {latitude}
            </Text>
            <Text testID="text-lng">
              {trans.longitude}: {longitude}
            </Text>
          </View>
        )}

        <View style={styles.geoButtonGroup}>
          <Button onPress={() => handleGetCurrLocation(false)} testID="button-curr-location">
            {loading.current ? trans.loadingText : trans.buttonCurrLocation}
          </Button>
          {isOnline && (
            <Button
              type="outline"
              onPress={() => handleGetCurrLocation(true)}
              testID="button-open-map"
            >
              {loading.map ? trans.loadingText : trans.buttonOpenMap}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default TypeGeo;
