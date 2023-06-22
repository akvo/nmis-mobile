import React from 'react';
import { View, PermissionsAndroid, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const TypeImage = () => {
  const [singleFile, setSingleFile] = React.useState(null);

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

  const uploadImage = async () => {
    const BASE_URL = 'xxxx';

    if (!singleFile) {
      console.info('Please Select File first');
      return;
    }

    // Check if any file is selected or not
    // If file selected then create FormData
    const data = new FormData();

    data.append('file_attachment', {
      uri: singleFile.uri,
      name: singleFile.name,
      type: singleFile.mimeType,
    });
    return data;

    // return
    try {
      let res = await fetch(BASE_URL + 'tutorial/upload.php', {
        method: 'post',
        body: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        timeout: 5000,
      });

      const result = await res.json();
      console.log('result', result);
      if (result.status == 1) {
        Alert.alert('Info', result.msg);
      }
    } catch (error) {
      // Error retrieving data
      // Alert.alert('Error', error.message);
      console.log('error upload', error);
    }
  };

  async function selectFile() {
    try {
      const result = await checkPermissions();
      if (result) {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
          type: 'image/*',
        });

        if (result.type === 'success') {
          // Printing the log realted to the file
          console.log('res : ' + JSON.stringify(result));
          // Setting the state to show single file attributes
          setSingleFile(result);
        }
      }
    } catch (err) {
      setSingleFile(null);
      console.warn(err);
      return false;
    }
  }

  return (
    <View style={styles.mainBody}>
      {/*Showing the data of selected Single file*/}
      {singleFile != null ? (
        <Text style={styles.textStyle}>
          File Name: {singleFile.name ? singleFile.name : ''}
          {'\n'}
          Type: {singleFile.type ? singleFile.type : ''}
          {'\n'}
          File Size: {singleFile.size ? singleFile.size : ''}
          {'\n'}
          URI: {singleFile.uri ? singleFile.uri : ''}
          {'\n'}
        </Text>
      ) : null}

      <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5} onPress={selectFile}>
        <Text style={styles.buttonTextStyle}>Select File</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TypeImage;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
});
