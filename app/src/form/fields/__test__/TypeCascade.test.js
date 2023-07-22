import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import TypeCascade from '../TypeCascade';

const dummyLocations = [
  { id: 106, name: 'DI YOGYAKARTA', parent: 0 },
  { id: 107, name: 'KAB. BANTUL', parent: 106 },
  { id: 109, name: 'Sabdodadi', parent: 107 },
  { id: 110, name: 'Bantul', parent: 107 },
  { id: 111, name: 'JAWA TENGAH', parent: 0 },
  { id: 112, name: 'KAB. PURBALINGGA', parent: 111 },
  { id: 113, name: 'KAB. BANYUMAS', parent: 111 },
  { id: 114, name: 'Kembaran', parent: 113 },
];

describe('TypeCascade', () => {
  it('Should not show options when the data source is not set.', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const values = { [fieldID]: null };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const { queryByTestId } = render(
      <TypeCascade onChange={mockedOnChange} id={fieldID} name={fieldName} values={values} />,
    );

    const firstDropdown = queryByTestId('dropdown-cascade-0');
    expect(firstDropdown).toBeNull();
  });

  it('Should not be able to update values when options is empty', async () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const dataSource = [{ id: 1, name: 'Only parent', parent: null }];

    const { getByTestId } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dataSource}
      />,
    );

    const dropdownEl = getByTestId('dropdown-cascade-0');
    expect(dropdownEl).toBeDefined();

    act(() => {
      fireEvent(dropdownEl, 'onChange', { value: 2 });
    });

    await waitFor(() => {
      const txtValuesEl = getByTestId('text-values');
      expect(txtValuesEl).toBeDefined();
      expect(txtValuesEl.props.children).toBeUndefined();
    });
  });

  it('Should have a specific parent dropdown when source is defined.', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = 110;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const questionSource = { file: 'file.sqlite', parent_id: 107 };
    const { getByTestId, getByText, queryByText } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dummyLocations}
        source={questionSource}
      />,
    );

    const parentDropdown = getByTestId('dropdown-cascade-0');
    expect(parentDropdown).toBeDefined();
    const invalidOption = queryByText('DI YOGYAKARTA');
    expect(invalidOption).toBeNull();

    const validOption = queryByText('Bantul');
    expect(validOption).toBeDefined();
  });

  it('Should have one or more child dropdowns.', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = 106;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });
    const { getByTestId, getByText } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dummyLocations}
      />,
    );

    const parentDropdown = getByTestId('dropdown-cascade-0');
    expect(parentDropdown).toBeDefined();
    const childDropdown = getByTestId('dropdown-cascade-1');
    expect(childDropdown).toBeDefined();
  });

  it('Should depend on the selected option in the parent dropdown.', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const selectedOption = 107;
    const values = { [fieldID]: selectedOption };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });
    const { getByTestId, getByText } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dummyLocations}
      />,
    );

    const firstDropdown = getByTestId('dropdown-cascade-0');
    expect(firstDropdown).toBeDefined();
    const firstOption = getByText('DI YOGYAKARTA');
    expect(firstOption).toBeDefined();

    const secondDropdown = getByTestId('dropdown-cascade-1');
    expect(secondDropdown).toBeDefined();

    const secondOption = getByText('KAB. BANTUL');
    expect(secondOption).toBeDefined();

    const thirdDropdown = getByTestId('dropdown-cascade-2');
    expect(thirdDropdown).toBeDefined();
  });

  it('Should update child dropdowns when the selected option in the parent dropdown changes.', async () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const selectedOption = 107;
    const values = { [fieldID]: selectedOption };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });
    const { getByTestId, getByText, queryByTestId, queryByText } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dummyLocations}
      />,
    );

    const firstDropdown = getByTestId('dropdown-cascade-0');
    expect(firstDropdown).toBeDefined();

    const firstOption = getByText('DI YOGYAKARTA');
    expect(firstOption).toBeDefined();

    const secondDropdown = getByTestId('dropdown-cascade-1');
    expect(secondDropdown).toBeDefined();

    const secondOption = getByText('KAB. BANTUL');
    expect(secondOption).toBeDefined();

    const thirdDropdown = getByTestId('dropdown-cascade-2');
    expect(thirdDropdown).toBeDefined();

    const select2Items = [
      { id: 111, name: 'JAWA TENGAH' },
      { id: 112, name: 'KAB. PURBALINGGA' },
    ];

    act(() => {
      // Change first & second dropdown
      fireEvent(firstDropdown, 'onChange', { value: select2Items[0].id });
      fireEvent(secondDropdown, 'onChange', { value: select2Items[1].id });

      const mockValues = select2Items.map((s) => s.name).join('|');
      mockedOnChange(fieldID, mockValues);
    });

    await waitFor(() => {
      const dropdownValue1 = queryByText('JAWA TENGAH');
      expect(dropdownValue1).toBeDefined();

      const dropdownValue2 = queryByText('KAB. PURBALINGGA');
      expect(dropdownValue2).toBeDefined();

      const previousOption = queryByText('KAB. BANTUL');
      expect(previousOption).toBeNull();

      const thirdNotFound = queryByTestId('dropdown-cascade-2');
      expect(thirdNotFound).toBeNull();
    });
  });
});
