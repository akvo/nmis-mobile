import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
jest.useFakeTimers();
import { Webform } from '../../src/form';

const navigation = {
  navigate: jest.fn(),
};

const route = {
  params: {
    name: 'Form Name',
  },
};

describe('Webform component', () => {
  test('should render component correctly', () => {
    const tree = renderer.create(<Webform />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('submits form data correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const modifiedInitialValues = {
      ...Webform.initialValues,
      name: 'John',
      birthDate: new Date('01-01-1992'),
      age: '31',
      gender: 'male',
      education: 'Bachelor',
      hobby: ['Traveling'],
      foods: ['Fried Rice', 'Rendang'],
      comment: 'Lorem ipsum...',
    };

    const { queryByTestId } = render(
      <Webform initialValues={modifiedInitialValues} navigation={navigation} route={route} />,
    );

    const nextBtn = queryByTestId('form-nav-btn-next');
    expect(nextBtn).toBeDefined();
    fireEvent.press(nextBtn);

    const formSubmitBtn = queryByTestId('form-btn-submit');
    expect(formSubmitBtn).toBeDefined();
    fireEvent.press(formSubmitBtn);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1));
    expect(consoleSpy).toHaveBeenCalledWith({
      age: '31',
      birthDate: new Date('01-01-1992'),
      comment: 'Lorem ipsum...',
      education: 'Bachelor',
      foods: ['Fried Rice', 'Rendang'],
      gender: 'male',
      hobby: ['Traveling'],
      image: null,
      name: 'John',
    });

    consoleSpy.mockRestore();
  });
});
