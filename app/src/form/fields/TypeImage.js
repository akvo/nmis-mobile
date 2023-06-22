import React from 'react';
import { View, PermissionsAndroid, StyleSheet, ActivityIndicator } from 'react-native';
import { Image, Button } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from '../../components';

const TypeImage = ({ onChange }) => {
  const [selectedImage, setSelectedImage] = React.useState(null);

  React.useEffect(() => {
    if (onChange) {
      onChange('image', selectedImage);
    }
  }, [selectedImage, onChange]);

  const checkPermissions = async () => {
    try {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      if (result) {
        // Access granted
        return true;
      }

      // Ask for Access
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'You need to give storage permission to download and save the file',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.info('You can use the camera');
        return true;
      }

      console.warn('Camera permission denied');
      return false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  async function selectFile() {
    try {
      const result = await checkPermissions();
      if (result) {
        const result = await ImagePicker.launchImageLibraryAsync({
          quality: 1,
        });

        if (result?.canceled) {
          console.warn('You did not select any image.');
          return;
        }
        // Setting the state to show single file attributes
        setSelectedImage(result.assets[0]);
      }
    } catch (err) {
      setSelectedImage(null);
      console.warn(err);
      return false;
    }
  }

  return (
    <View style={styles.fieldImageContainer}>
      {selectedImage != null ? (
        <Image
          source={{ uri: selectedImage?.uri }}
          containerStyle={styles.imagePreview}
          PlaceholderContent={<ActivityIndicator />}
        />
      ) : null}
      <Stack row columns={2}>
        <Button title="Select File" onPress={selectFile} />
        <Button
          containerStyle={styles.buttonRemoveFile}
          title="Remove"
          color="secondary"
          onPress={() => setSelectedImage(null)}
          disabled={!selectedImage}
        />
      </Stack>
    </View>
  );
};

export default TypeImage;

const styles = StyleSheet.create({
  fieldImageContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  imagePreview: { aspectRatio: 1, width: '100%', flex: 1, marginBottom: 15 },
  buttonRemoveFile: {
    marginLeft: 12,
  },
});
