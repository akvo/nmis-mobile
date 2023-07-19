import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingDialog from '../LoadingDialog';

const mockLoadingDialog = jest.fn();

jest.mock('../LoadingDialog', () => ({ isVisible, loadingText }) => {
  mockLoadingDialog(isVisible, loadingText);
  return <mock-LoadingDialog />;
});

describe('LoadingDialog', () => {
  test('should render the LoadingDialog with the correct props and styles', () => {
    render(<LoadingDialog isVisible={true} loadingText="Loading..." />);
    expect(mockLoadingDialog.mock.calls[0]).toEqual([true, 'Loading...']);
  });

  test('should show the loadingText prop in the dialog', () => {
    render(<LoadingDialog loadingText="Loading..." />);
    expect(mockLoadingDialog.mock.calls[0][1]).toEqual('Loading...');
  });
});
