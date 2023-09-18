import React from 'react';
import renderer from 'react-test-renderer';
import { render, waitFor } from '@testing-library/react-native';
import QuestionGroup from '../QuestionGroup';
import { useField } from 'formik';

jest.mock('formik', () => ({
  useField: jest.fn(),
}));

// Mock the return values of useField
const mockField = { name: 'myField', value: '', onChange: jest.fn() };
const mockMeta = { touched: false, error: '' };
const mockHelpers = { setValue: jest.fn(), setTouched: jest.fn() };

// Mock the useField function with the correct return structure
useField.mockReturnValue([mockField, mockMeta, mockHelpers]);

const questionGroup = {
  id: 1,
  name: 'Group 1',
  description: 'Lorem ipsum',
  order: 1,
  translations: [
    {
      name: 'Grup 1',
      language: 'id',
    },
  ],
  question: [
    {
      id: 1,
      name: 'Your Name',
      order: 1,
      type: 'input',
      required: true,
      meta: true,
      translations: [
        {
          name: 'Nama Anda',
          language: 'id',
        },
      ],
    },
  ],
};

describe('QuestionGroup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', async () => {
    const tree = renderer
      .create(
        <QuestionGroup
          index={1}
          group={questionGroup}
          setFieldValue={() => jest.fn()}
          values={null}
        />,
      )
      .toJSON();
    await waitFor(() => expect(tree).toMatchSnapshot());
  });

  it.todo('should render question group name');
  it.todo('should render question group description');
  it.todo('should render repeat title if question group repeatable');
  it.todo('should render add more button if question group repeatable');
  it.todo('should render delete repeat group button if question group repeatable');
  it.todo('should render more question group if add more button pressed');
  it.todo('should remove a repeatable question group if delete button pressed');
});
