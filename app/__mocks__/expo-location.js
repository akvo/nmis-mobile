export const getCurrentPositionAsync = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    coords: {
      latitude: 37.12345,
      longitude: -122.6789,
    },
  });
});

export const requestForegroundPermissionsAsync = jest.fn().mockImplementation(() => {
  return Promise.resolve({ status: 'granted' });
});

export const Location = {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
};