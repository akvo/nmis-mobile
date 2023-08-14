import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingDialog from '../LoadingDialog';

describe('LoadingDialog', () => {
  test('should be hidden when isVisible prop is false', () => {
    const wrapper = render(<LoadingDialog />);

    const loadingDialogElement = wrapper.getByTestId('loading-dialog');
    expect(loadingDialogElement.props.visible).toBe(false);
  });

  test('should be visible when isVisible prop is true', () => {
    const wrapper = render(<LoadingDialog isVisible={true} />);

    const loadingDialogElement = wrapper.getByTestId('loading-dialog');
    expect(loadingDialogElement.props.visible).toBe(true);
  });

  test('should show the LoadingDialog with text', () => {
    const wrapper = render(<LoadingDialog isVisible={true} loadingText="Loading..." />);

    const iconElement = wrapper.getByTestId('Dialog__Loading');
    expect(iconElement).toBeTruthy();

    const textElement = wrapper.getByTestId('loading-dialog-text');
    expect(textElement.props.children).toEqual('Loading...');
  });

  test('should show the LoadingDialog without text', () => {
    const wrapper = render(<LoadingDialog isVisible={true} />);

    const iconElement = wrapper.getByTestId('Dialog__Loading');
    expect(iconElement).toBeTruthy();

    const textElement = wrapper.queryByTestId('loading-dialog-text');
    expect(textElement).toBeFalsy();
  });
});
