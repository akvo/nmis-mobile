import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Button } from '@rneui/themed';
import { FormState } from '../store';
import { loc } from '../lib';

const MapView = ({ navigation, route, radius = 20 }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markerData, setMarkerData] = useState({
    lat: null,
    lng: null,
    distance: 0,
  });
  const webViewRef = useRef(null);
  const selectedForm = FormState.useState((s) => s.form);

  const goBack = () => {
    navigation.navigate('FormPage', {
      id: selectedForm?.id,
      name: selectedForm?.name,
      newSubmission: route?.params?.newSubmission,
    });
  };

  const handleCurrentLocation = () => {
    setLoading(true);
    loc.getCurrentLocation(
      (res) => {
        const { latitude: lat, longitude: lng } = res?.coords;
        setMarkerData({
          ...markerData,
          lat,
          lng,
        });

        const eventData = JSON.stringify({ type: 'changeMarker', data: { lat, lng } });
        webViewRef.current.postMessage(eventData);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setLocation({});
        if (Platform.OS === 'android') {
          ToastAndroid.show(err.message, ToastAndroid.SHORT);
        }
      },
    );
  };

  const loadHtml = async () => {
    const [{ localUri }] = await Asset.loadAsync(require('../../assets/map.html'));
    let fileContents = await FileSystem.readAsStringAsync(localUri);
    let { latitude: lat, longitude: lng } = route?.params;
    lat = lat || 0;
    lng = lng || 0;
    fileContents = fileContents
      .replace(/{{latitude}}/g, lat)
      .replace(/{{longitude}}/g, lng)
      .replace(/{{radius}}/g, radius);
    setHtmlContent(fileContents);
  };

  const handleUseSelectedLocation = () => {
    const { lat, lng, distance } = markerData;
    const { id: questionID } = route?.params;
    if (questionID) {
      FormState.update((s) => {
        s.currentValues = {
          ...s.currentValues,
          [questionID]: [lat, lng],
        };
      });
      goBack();
    }
  };

  const disabledButton = markerData.distance > radius;

  useEffect(() => {
    loadHtml();
  }, []);

  useEffect(() => {
    if (loading && htmlContent) {
      setLoading(false);
    }
  }, [loading, htmlContent]);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator />}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.map}
        onMessage={(event) => {
          const messageData = JSON.parse(event.nativeEvent.data);
          if (messageData.type === 'markerClicked') {
            setMarkerData(messageData.data);
          }
        }}
        testID="webview-map"
      />
      <View style={styles.buttonContainer}>
        <Button onPress={handleCurrentLocation} testID="button-get-current-loc">
          Use current location
        </Button>
        <Button
          onPress={handleUseSelectedLocation}
          type="outline"
          testID="button-selected-loc"
          disabled={disabledButton}
        >
          Use selected location
        </Button>
        <Button onPress={goBack} type="clear" testID="button-back">
          Cancel
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 8,
  },
});

export default MapView;
