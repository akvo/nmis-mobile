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

const question = {
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
};

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
  question: [question],
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

  it('should render question group name', async () => {
    const wrapper = render(
      <QuestionGroup
        index={1}
        group={questionGroup}
        setFieldValue={() => jest.fn()}
        values={null}
      />,
    );
    await waitFor(() => {
      const title = wrapper.queryByTestId('text-name');
      expect(title).toBeTruthy();
    });
  });

  it('should not render question group description if not defined', async () => {
    const questionGroupTmp = {
      ...questionGroup,
      description: null,
    };
    const wrapper = render(
      <QuestionGroup
        index={1}
        group={questionGroupTmp}
        setFieldValue={() => jest.fn()}
        values={null}
      />,
    );
    await waitFor(() => {
      const description = wrapper.queryByTestId('text-description');
      expect(description).toBeFalsy();
      expect(description).toEqual(null);
    });
  });

  it('should render question group description if any', async () => {
    const wrapper = render(
      <QuestionGroup
        index={1}
        group={questionGroup}
        setFieldValue={() => jest.fn()}
        values={null}
      />,
    );
    await waitFor(() => {
      const description = wrapper.queryByTestId('text-description');
      expect(description).toBeTruthy();
    });
  });

  it('should not render repeatable title and buttons if question group not repeatable', async () => {
    const wrapper = render(
      <QuestionGroup
        index={0}
        group={questionGroup}
        setFieldValue={() => jest.fn()}
        values={null}
      />,
    );

    const repeatTitle = wrapper.queryByTestId('repeat-title');
    expect(repeatTitle).toBeFalsy();
    const repeatDelete = wrapper.queryByTestId('repeat-delete-button');
    expect(repeatDelete).toBeFalsy();
    const repeatAddMore = wrapper.queryByTestId('repeat-add-more-button');
    expect(repeatAddMore).toBeFalsy();
  });

  it('should render repeatable title and buttons if question group repeatable', async () => {
    const questionGroupTmp = {
      ...questionGroup,
      repeatable: true,
    };
    const wrapper = render(
      <QuestionGroup
        index={0}
        group={questionGroupTmp}
        setFieldValue={() => jest.fn()}
        values={null}
      />,
    );

    const repeatTitle = wrapper.queryByTestId('repeat-title');
    expect(repeatTitle).toBeTruthy();
    const repeatDelete = wrapper.queryByTestId('repeat-delete-button');
    expect(repeatDelete).toBeFalsy();
    const repeatAddMore = wrapper.queryByTestId('repeat-add-more-button');
    expect(repeatAddMore).toBeTruthy();
  });

  it.todo('should render more question group if add more button pressed');
  it.todo('should remove a repeatable question group if delete button pressed');
});
