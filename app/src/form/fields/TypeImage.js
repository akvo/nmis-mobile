import React from 'react';
import { View, PermissionsAndroid, StyleSheet, ActivityIndicator } from 'react-native';
import { Image, Button, Dialog } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from '../../components';
import { FieldLabel } from '../support';
import { FormState } from '../../store';
import { i18n } from '../../lib';

// TODO: getImageBase64 (ARF)
// TODO: convertImageToBase64 (ARF)

const TypeImage = ({ onChange, keyform, id, name, tooltip, required, requiredSign }) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const activeLang = FormState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);

  React.useEffect(() => {
    if (onChange) {
      onChange(id, selectedImage);
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
          title: trans.imageStoragePerm,
          message: trans.imageCameraPerm,
          buttonNeutral: trans.imageAskLater,
          buttonNegative: trans.buttonCancel,
          buttonPositive: trans.buttonOk,
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.info('You can use the camera');
        return true;
      }

      console.info('Camera permission denied');
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  async function handleShowDialog() {
    const result = await checkPermissions();
    if (result) {
      setShowDialog(true);
      return true;
    }
    console.info('Access not granted!');
  }

  async function selectFile() {
    setShowDialog(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });
      if (result?.canceled) {
        console.info('You did not select any image.');
        return false;
      }
      setSelectedImage(result.assets[0]);
    } catch (err) {
      setSelectedImage(null);
      console.error(err);
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
        console.info('You did not select any image.');
        return false;
      }
      setSelectedImage(result.assets[0]);
    } catch (err) {
      setSelectedImage(null);
      console.error(err);
      return false;
    }
  }

  return (
    <View>
      <FieldLabel
        keyform={keyform}
        name={name}
        tooltip={tooltip}
        requiredSign={required ? requiredSign : null}
      />
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
            title={trans.buttonRemove}
            color="secondary"
            onPress={() => setSelectedImage(null)}
            disabled={!selectedImage}
            testID="btn-remove"
          />
        </Stack>
        <Dialog
          isVisible={showDialog}
          onBackdropPress={() => setShowDialog(false)}
          testID="popup-dialog"
        >
          <Button
            title={trans.buttonUseCamera}
            type="outline"
            onPress={handleCamera}
            testID="btn-use-camera"
          />
          <Button
            containerStyle={styles.buttonFromGallery}
            title={trans.buttonFromGallery}
            type="outline"
            onPress={selectFile}
            testID="btn-from-gallery"
          />
        </Dialog>
      </View>
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
  buttonFromGallery: {
    marginTop: 12,
  },
});
