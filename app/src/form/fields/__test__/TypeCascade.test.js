import React, { useState } from 'react';
import { render, fireEvent, act, waitFor, renderHook } from '@testing-library/react-native';
import TypeCascade from '../TypeCascade';
import { generateDataPointName } from '../../lib';
import { FormState } from '../../../store';

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

// According to the issue on @testing-library/react-native
import { View } from 'react-native';
jest.spyOn(View.prototype, 'measureInWindow').mockImplementation((cb) => {
  cb(18, 113, 357, 50);
});

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

  it('Should not be able to update values when options is empty', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const dataSource = [{ id: 1, name: 'Only parent', parent: null }];

    const { queryByTestId } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dataSource}
      />,
    );

    const dropdownEl = queryByTestId('dropdown-cascade-0');
    expect(dropdownEl).toBeNull();
  });

  it('Should have a specific parent dropdown when source is defined.', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = [107, 110];
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
    const initialValue = [111, 112];
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });
    const { getByTestId, getByText, rerender } = render(
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

    fireEvent.press(childDropdown);

    const option1 = getByText('KAB. BANYUMAS');
    expect(option1).toBeDefined();
  });

  it('Should depend on the selected option in the parent dropdown.', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const selectedOption = [106, 107];
    const values = { [fieldID]: selectedOption };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });
    const { getByTestId, getByText, queryByText } = render(
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

    // change first dropdown
    fireEvent.press(firstDropdown);

    const selectedParent = getByText('JAWA TENGAH');
    fireEvent.press(selectedParent);

    // second dropdown is empty
    expect(queryByText('KAB. BANTUL')).toBeNull();
  });

  it('should set values based on the required level', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const { getByTestId, getByText, debug, rerender } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dummyLocations}
      />,
    );

    const { result } = renderHook(() =>
      useState([
        {
          options: [
            { id: 106, name: 'DI YOGYAKARTA' },
            { id: 111, name: 'JAWA TENGAH' },
          ],
          value: null,
        },
      ]),
    );
    const [dropdownItems, setDropdownItems] = result.current;

    const mockedDropdownChange = jest.fn((index, value) => {
      const nextIndex = index + 1;
      const findValue = dummyLocations.find((d) => d?.id === value);
      if (findValue) {
        const updatedItems = dropdownItems
          .slice(0, nextIndex)
          .map((d, dx) => (dx === index ? { ...d, value } : d));

        const options = dummyLocations?.filter((d) => d?.parent === value);

        if (options.length) {
          updatedItems.push({
            options,
            value: null,
          });
        }
        const dropdownValues = updatedItems.filter((dd) => dd.value).map((dd) => dd.value);
        const finalValues = updatedItems.length !== dropdownValues.length ? null : dropdownValues;

        mockedOnChange(fieldID, finalValues);

        setDropdownItems(updatedItems);
      }
    });

    const dropdown1 = getByTestId('dropdown-cascade-0');
    expect(dropdown1).toBeDefined();

    fireEvent.press(dropdown1);

    const dropdown1Selected = getByText('DI YOGYAKARTA');
    fireEvent.press(dropdown1Selected);

    const dropdown2 = getByTestId('dropdown-cascade-1');
    expect(dropdown2).toBeDefined();

    fireEvent.press(dropdown2);
    const dropdown2Selected = getByText('KAB. BANTUL');
    fireEvent.press(dropdown2Selected);

    // it should still null
    expect(values[fieldID]).toBeNull();

    const dropdown3 = getByTestId('dropdown-cascade-2');
    expect(dropdown3).toBeDefined();

    fireEvent.press(dropdown3);
    const dropdown3Selected = getByText('Sabdodadi');
    fireEvent.press(dropdown3Selected);

    expect(values[fieldID]).toEqual([106, 107, 109]);
  });

  it('should sorted items correctly', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const dataSource = [
      { id: 1, name: 'Nuffic', parent: 0 },
      { id: 2, name: 'SNV', parent: 0 },
      { id: 3, name: 'Akvo', parent: 0 },
    ];

    const { getByTestId, getByText } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dataSource}
      />,
    );

    const dropdown1 = getByTestId('dropdown-cascade-0');
    fireEvent.press(dropdown1);

    const option1 = getByText('Akvo');
    expect(option1).toBeDefined();
    const option2 = getByText('Nuffic');
    expect(option2).toBeDefined();
    const option3 = getByText('SNV');
    expect(option3).toBeDefined();
  });

  it('should not show required sign if required param is false and requiredSign is not defined', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const dataSource = [
      { id: 1, name: 'Nuffic', parent: 0 },
      { id: 2, name: 'SNV', parent: 0 },
      { id: 3, name: 'Akvo', parent: 0 },
    ];

    const wrapper = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dataSource}
        required={false}
      />,
    );
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeFalsy();
  });

  it('should not show required sign if required param is false but requiredSign is defined', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const dataSource = [
      { id: 1, name: 'Nuffic', parent: 0 },
      { id: 2, name: 'SNV', parent: 0 },
      { id: 3, name: 'Akvo', parent: 0 },
    ];

    const wrapper = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dataSource}
        required={false}
        requiredSign="*"
      />,
    );
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeFalsy();
  });

  it('should not show required sign if required param is true and requiredSign defined', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const dataSource = [
      { id: 1, name: 'Nuffic', parent: 0 },
      { id: 2, name: 'SNV', parent: 0 },
      { id: 3, name: 'Akvo', parent: 0 },
    ];

    const wrapper = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dataSource}
        required={true}
        requiredSign="*"
      />,
    );
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeTruthy();
  });

  it('should show required sign with custom requiredSign', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const dataSource = [
      { id: 1, name: 'Nuffic', parent: 0 },
      { id: 2, name: 'SNV', parent: 0 },
      { id: 3, name: 'Akvo', parent: 0 },
    ];

    const wrapper = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dataSource}
        required={true}
        requiredSign="**"
      />,
    );
    const requiredIcon = wrapper.getByText('**');
    expect(requiredIcon).toBeTruthy();
  });

  it('should use id when parent id not found', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const questionSource = { file: 'file.sqlite', parent_id: 114 };
    const { getByTestId, getByText } = render(
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

    fireEvent.press(parentDropdown);

    const validOption = getByText('Kembaran');
    expect(validOption).toBeDefined();
  });

  it('Should get cascade name as datapoint name', async () => {
    /**
     * Set datapointName first
     */

    act(() => {
      FormState.update((s) => {
        s.dataPointName = [
          { type: 'cascade', value: null },
          { type: 'text', value: 'Example' },
        ];
      });
    });
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const questionSource = { file: 'file.sqlite', parent_id: 107 };
    const { getByTestId, getByText } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dummyLocations}
        source={questionSource}
      />,
    );

    const dropdown1 = getByTestId('dropdown-cascade-0');
    expect(dropdown1).toBeDefined();

    const dropdown2 = getByTestId('dropdown-cascade-1');
    expect(dropdown2).toBeDefined();
    fireEvent.press(dropdown2);

    const selectedText = getByText('Sabdodadi');
    fireEvent.press(selectedText);

    act(() => {
      mockedOnChange(fieldID, [107, 109]);
      const cascadeName = 'Sabdodadi';
      FormState.update((s) => {
        s.dataPointName = s.dataPointName.map((dn) =>
          dn.type === 'cascade' ? { ...dn, value: cascadeName } : dn,
        );
      });
    });

    await waitFor(() => {
      const { result } = renderHook(() => FormState.useState((s) => s.dataPointName));
      const { dpName } = generateDataPointName(result.current);
      expect(dpName).toBe('Sabdodadi - Example');
      expect(values[fieldID]).toEqual([107, 109]);
    });
  });

  it('Should not get cascade name as datapoint name when FormState.dataPointName is empty or there is no cascade type', async () => {
    /**
     * Update datapointName first
     */
    act(() => {
      FormState.update((s) => {
        s.dataPointName = [];
      });
    });
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const questionSource = { file: 'file.sqlite', parent_id: 107 };
    const { getByTestId, getByText, rerender } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dummyLocations}
        source={questionSource}
      />,
    );

    const dropdown1 = getByTestId('dropdown-cascade-0');
    expect(dropdown1).toBeDefined();

    const dropdown2 = getByTestId('dropdown-cascade-1');
    expect(dropdown2).toBeDefined();
    fireEvent.press(dropdown2);

    const selectedText = getByText('Bantul');
    fireEvent.press(selectedText);

    act(() => {
      mockedOnChange(fieldID, [107, 108]);
      const cascadeName = 'Bantul';
      FormState.update((s) => {
        s.dataPointName = s.dataPointName.map((dn) =>
          dn.type === 'cascade' ? { ...dn, value: cascadeName } : dn,
        );
      });
    });

    await waitFor(() => {
      const { result } = renderHook(() => FormState.useState((s) => s.dataPointName));
      const { dpName } = generateDataPointName(result.current);
      expect(dpName).toBe('');
      expect(values[fieldID]).toEqual([107, 108]);
    });

    act(() => {
      FormState.update((s) => {
        s.dataPointName = [
          { type: 'text', value: 'Example' },
          { types: 'geo', value: null },
        ];
      });
    });

    rerender(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dummyLocations}
        source={questionSource}
      />,
    );

    fireEvent.press(dropdown2);

    const selectedText2 = getByText('Sabdodadi');
    fireEvent.press(selectedText2);

    act(() => {
      mockedOnChange(fieldID, [107, 109]);
      const cascadeName = 'Sabdodadi';
      FormState.update((s) => {
        s.dataPointName = s.dataPointName.map((dn) =>
          dn.type === 'cascade' ? { ...dn, value: cascadeName } : dn,
        );
      });
    });

    await waitFor(() => {
      const { result } = renderHook(() => FormState.useState((s) => s.dataPointName));
      const { dpName } = generateDataPointName(result.current);
      expect(dpName).toBe('Example');
      expect(values[fieldID]).toEqual([107, 109]);
    });
  });
});
