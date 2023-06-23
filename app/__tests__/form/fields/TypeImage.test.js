import React from 'react';
import { render, fireEvent, waitFor, act } from 'react-native-testing-library';
import * as ImagePicker from 'expo-image-picker';
import { TypeImage } from '../../../src/form/fields';

jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => {
  return {
    PERMISSIONS: {
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    },
    RESULTS: {
      GRANTED: 'granted',
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
});
