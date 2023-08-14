import React, { useEffect, useState, useCallback } from 'react';
import { View, PermissionsAndroid, StyleSheet, ActivityIndicator } from 'react-native';
import { Image, Button, Dialog } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from '../../components';
import { FieldLabel } from '../support';
import { FormState } from '../../store';
import { i18n } from '../../lib';

const TypeImage = ({ onChange, keyform, id, values, name, tooltip, required, requiredSign }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(values?.[id]);
  const [granted, setGranted] = useState(true);
  const activeLang = FormState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);

  const checkPermissions = useCallback(async () => {
    // Ask for Access
    const askPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: trans.imageStoragePerm,
        message: trans.imageCameraPerm,
        buttonNeutral: trans.imageAskLater,
        buttonNegative: trans.buttonCancel,
        buttonPositive: trans.buttonOk,
      },
    );
    if (askPermission !== PermissionsAndroid.RESULTS.GRANTED) {
      setGranted(false);
    }
  }, []);

  const handleShowDialog = () => {
    if (granted) {
      setShowDialog(true);
      return;
    }
    console.info('Access not granted!');
  };

  const handleOnChange = (dataResult) => {
    const imageType = dataResult.assets[0].uri.split('.').slice(-1)[0];
    const imageBs64 = dataResult.assets[0].base64;
    const imageValue = `data:image/${imageType};base64,${imageBs64}`;
    onChange(id, imageValue);
    setSelectedImage(imageValue);
  };

  const selectFile = async () => {
    setShowDialog(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        base64: true,
      });
      if (!result?.canceled) {
        handleOnChange(result);
      }
    } catch (err) {
      setSelectedImage(null);
      console.error(err);
    }
  };

  const handleCamera = async () => {
    setShowDialog(false);
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        base64: true,
      });
      if (!result?.canceled) {
        handleOnChange(result);
      }
    } catch (err) {
      setSelectedImage(null);
      console.error(err);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return (
    <View>
      <FieldLabel
        keyform={keyform}
        name={name}
        tooltip={tooltip}
        requiredSign={required ? requiredSign : null}
      />
      <View style={styles.fieldImageContainer}>
        {selectedImage && typeof selectedImage === 'string' && (
          <Image
            source={{ uri: selectedImage }}
            containerStyle={styles.imagePreview}
            PlaceholderContent={<ActivityIndicator />}
            testID="image-preview"
          />
        )}
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
