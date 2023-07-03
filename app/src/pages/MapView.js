import React from 'react';
import { View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const MapView = () => {
  const [htmlContent, setHtmlContent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const webViewRef = React.useRef(null);

  const changeMarker = () => {
    // Code to change the marker in Leaflet
    // You can use postMessage to send a message to the WebView and handle it in Leaflet
    const lat = -7.3912838;
    const lng = 109.4651336;
    const eventData = JSON.stringify({ type: 'changeMarker', data: { lat, lng } });
    webViewRef.current.postMessage(eventData);
  };

  const handleMarkerClick = (markerData) => {
    // Access the latitude and longitude values from markerData
    const { lat, lng } = markerData;
    console.log('Latitude:', lat);
    console.log('Longitude:', lng);
  };

  const loadHtml = async () => {
    const [{ localUri }] = await Asset.loadAsync(require('../../assets/map.html'));
    const fileContents = await FileSystem.readAsStringAsync(localUri);
    setHtmlContent(fileContents);
  };

  React.useEffect(() => {
    loadHtml();
  }, []);

  React.useEffect(() => {
    if (loading && htmlContent) {
      setLoading(false);
    }
  }, [loading, htmlContent]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Change Marker" onPress={changeMarker} />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.map} />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.map}
          onMessage={(event) => {
            const messageData = JSON.parse(event.nativeEvent.data);
            if (messageData.type === 'markerClicked') {
              handleMarkerClick(messageData.data);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
  },
});

export default MapView;
