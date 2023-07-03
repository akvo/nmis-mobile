import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const MapView = () => {
  const [htmlContent, setHtmlContent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const webViewRef = React.useRef(null);

  const handleMarkerClick = (markerData) => {
    // Access the latitude and longitude values from markerData
    const { lat, lng } = markerData;
    console.log('Latitude:', lat);
    console.log('Longitude:', lng);
  };

  const loadHtml = async () => {
    const [{ localUri }] = await Asset.loadAsync(require('../../assets/map.html'));
    let fileContents = await FileSystem.readAsStringAsync(localUri);

    const lat = -7.3912838;
    const lng = 109.4651336;

    fileContents = fileContents.replace(/{{latitude}}/g, lat).replace(/{{longitude}}/g, lng);
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
