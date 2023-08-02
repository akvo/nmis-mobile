import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';

import { MapState, UIState } from '../../store';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { loc, i18n } from '../../lib';

const TypeGeo = ({ onChange, values, keyform, id, name, tooltip, required, requiredSign }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const { latitude, longitude } = MapState.useState((s) => s);
  const { online: isOnline, lang: activeLang } = UIState.useState((s) => s);

  const trans = i18n.text(activeLang);

  const navigation = useNavigation();
  const route = useRoute();

  const handleOpenMapPress = () => {
    const params = { latitude, longitude };
    navigation.navigate('MapView', { ...route?.params, ...params });
  };

  const handleGetCurrLocation = async () => {
    setLoading(true);
    await loc.getCurrentLocation(
      ({ coords }) => {
        if (coords) {
          const { latitude, longitude } = coords;
          onChange(id, [latitude, longitude]);
          MapState.update((s) => {
            s.latitude = latitude;
            s.longitude = longitude;
          });
        }
        setLoading(false);
      },
      ({ message }) => {
        setLoading(false);
        setErrorMsg(message);
      },
    );
  };

  return (
    <View>
      <FieldLabel
        keyform={keyform}
        name={name}
        tooltip={tooltip}
        requiredSign={required ? requiredSign : null}
      />
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
        {isOnline && (
          <View style={styles.geoButtonGroup}>
            <Button onPress={handleGetCurrLocation} testID="button-curr-location">
              {loading ? trans.loadingText : trans.buttonCurrLocation}
            </Button>
            <Button type="outline" onPress={handleOpenMapPress} testID="button-open-map">
              {trans.buttonOpenMap}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default TypeGeo;
