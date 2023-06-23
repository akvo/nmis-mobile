import React from 'react';
import { View, PermissionsAndroid, StyleSheet, ActivityIndicator } from 'react-native';
import { Image, Button, Dialog } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from '../../components';
import { FieldLabel } from '../support';

// TODO: getImageBase64 (ARF)
// TODO: convertImageToBase64 (ARF)

const TypeImage = ({ onChange }) => {
  const [showDialog, setShowDialog] = React.useState(false);
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

  async function handleShowDialog() {
    const result = await checkPermissions();
    if (result) {
      setShowDialog(true);
      return true;
    }
    console.warn('Access not granted!');
  }

  async function selectFile() {
    setShowDialog(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });
      if (result?.canceled) {
        console.warn('You did not select any image.');
        return false;
      }
      setSelectedImage(result.assets[0]);
    } catch (err) {
      setSelectedImage(null);
      console.warn(err);
      return false;
    }
  }

  async function handleCamera() {
    setShowDialog(false);
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
      });
      if (result?.canceled) {
        console.warn('You did not select any image.');
        return false;
      }
      setSelectedImage(result.assets[0]);
    } catch (err) {
      setSelectedImage(null);
      console.warn(err);
      return false;
    }
  }

  return (
    <>
      <FieldLabel label="Image" />
      <View style={styles.fieldImageContainer}>
        {selectedImage != null ? (
          <Image
            source={{ uri: selectedImage?.uri }}
            containerStyle={styles.imagePreview}
            PlaceholderContent={<ActivityIndicator />}
            testID="image-preview"
          />
        ) : null}
        <Stack row columns={2}>
          <Button title="Select File" onPress={handleShowDialog} testID="btn-select-file" />
          <Button
            containerStyle={styles.buttonRemoveFile}
            title="Remove"
            color="secondary"
            onPress={() => setSelectedImage(null)}
            disabled={!selectedImage}
            testID="btn-remove"
          />
        </Stack>
        <Dialog isVisible={showDialog} onBackdropPress={() => setShowDialog(false)}>
          <Button title="Use Camera" type="outline" onPress={handleCamera} />
          <Button
            containerStyle={styles.buttonFromGallery}
            title="From Gallery"
            type="outline"
            onPress={selectFile}
          />
        </Dialog>
      </View>
    </>
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
  buttonFromGallery: {
    marginTop: 12,
  },
});
