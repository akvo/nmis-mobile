import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Button,
  Platform,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { MapState, FormState } from '../store';
import { loc } from '../lib';

const MapView = ({ navigation, route }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);
  const selectedForm = FormState.useState((s) => s.form);

  const updateMapState = (markerData) => {
    const { lat, lng } = markerData;
    MapState.update((s) => {
      s.latitude = lat;
      s.longitude = lng;
    });
  };

  const handleCurrentLocation = () => {
    setLoading(true);
    loc.getCurrentLocation(
      (res) => {
        const { latitude: lat, longitude: lng } = res?.coords;
        updateMapState({ lat, lng });

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
    const { latitude: lat, longitude: lng } = route?.params;
    fileContents = fileContents.replace(/{{latitude}}/g, lat).replace(/{{longitude}}/g, lng);
    setHtmlContent(fileContents);
  };

  useEffect(() => {
    loadHtml();
  }, []);

  useEffect(() => {
    if (loading && htmlContent) {
      setLoading(false);
    }
  }, [loading, htmlContent]);

  useEffect(() => {
    const handleBackPress = () => {
      navigation.navigate('FormPage', { id: selectedForm?.id, name: selectedForm?.name });
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      backHandler.remove();
    };
  }, []);

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
            updateMapState(messageData.data);
          }
        }}
        testID="webview-map"
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Use current location"
          onPress={handleCurrentLocation}
          testID="button-get-current-loc"
        />
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
    padding: 10,
  },
});

export default MapView;
