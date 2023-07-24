import React from 'react';
import { render, fireEvent, waitFor } from 'react-native-testing-library';
import * as ImagePicker from 'expo-image-picker';
import TypeImage from '../TypeImage';
import { PermissionsAndroid } from 'react-native';

jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => {
  return {
    PERMISSIONS: {
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
    check: jest.fn().mockResolvedValue(true),
    request: jest.fn().mockResolvedValue('granted'),
  };
});

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));

const mockImagePickerResult = {
  canceled: false,
  assets: [
    {
      uri: 'selected_image_uri',
    },
  ],
};

describe('TypeImage component', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Access external storage/camera granted', () => {
    it('should render the component correctly', () => {
      const { getByTestId, queryByTestId } = render(<TypeImage />);

      const fieldLabel = getByTestId('field-label');
      expect(fieldLabel).toBeDefined();

      const btnSelectFile = getByTestId('btn-select-file');
      expect(btnSelectFile).toBeDefined();

      const btnRemove = getByTestId('btn-remove');
      expect(btnRemove).toBeDefined();

      const imagePreview = queryByTestId('image-preview');
      expect(imagePreview).toBeNull();
    });

    test('should update the selectedImage state when an image is selected', async () => {
      const setSelectedImage = jest.fn();
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce((selectedImage) => [selectedImage, setSelectedImage]);

      const { getByTestId, queryByTestId } = render(<TypeImage />);
      // select image
      fireEvent.press(getByTestId('btn-select-file'));

      jest.spyOn(ImagePicker, 'launchImageLibraryAsync').mockResolvedValue(mockImagePickerResult);

      await waitFor(() => expect(setSelectedImage).toHaveBeenCalledTimes(1));
    });

    test('should clear the selectedImage state when the remove button is pressed', async () => {
      const setSelectedImage = jest.fn();
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce((selectedImage) => [selectedImage, setSelectedImage]);

      const { getByTestId } = render(<TypeImage />);
      // select image
      fireEvent.press(getByTestId('btn-select-file'));

      jest.spyOn(ImagePicker, 'launchImageLibraryAsync').mockResolvedValue(mockImagePickerResult);

      await waitFor(() => expect(setSelectedImage).toHaveBeenCalledTimes(1));
      expect(setSelectedImage).toHaveBeenCalledTimes(1);

      // remove the image
      fireEvent.press(getByTestId('btn-remove'));
      expect(setSelectedImage).toHaveBeenCalledTimes(1);
    });

    test.todo('should not show required sign if required param is false or undefined')

    test.todo('should show required sign if required param is true')
  });

  describe('Request access external storage', () => {
    const mockPermissionAndroindRequest = {
      buttonNegative: 'Cancel',
      buttonNeutral: 'Ask Me Later',
      buttonPositive: 'OK',
      message: 'App needs access to your camera ',
      title: 'You need to give storage permission to download and save the file',
    };

    it('should show request to access external storage then denied', async () => {
      const consoleSpy = jest.spyOn(console, 'info');

      PermissionsAndroid.check.mockResolvedValueOnce(false);
      PermissionsAndroid.request.mockResolvedValueOnce(PermissionsAndroid.RESULTS.DENIED);

      const { getByTestId } = render(<TypeImage />);

      fireEvent.press(getByTestId('btn-select-file'));

      expect(PermissionsAndroid.check).toHaveBeenCalledWith(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      await waitFor(() =>
        expect(PermissionsAndroid.request).toHaveBeenCalledWith(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          mockPermissionAndroindRequest,
        ),
      );

      await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Camera permission denied'));

      consoleSpy.mockRestore();
    });

    it('should show request to access external storage then granted', async () => {
      const consoleSpy = jest.spyOn(console, 'info');

      PermissionsAndroid.check.mockResolvedValueOnce(false);
      PermissionsAndroid.request.mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED);

      const { getByTestId } = render(<TypeImage />);

      fireEvent.press(getByTestId('btn-select-file'));

      expect(PermissionsAndroid.check).toHaveBeenCalledWith(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      await waitFor(() =>
        expect(PermissionsAndroid.request).toHaveBeenCalledWith(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          mockPermissionAndroindRequest,
        ),
      );

      await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('You can use the camera'));

      consoleSpy.mockRestore();
    });
  });
});
