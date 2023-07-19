import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { render, fireEvent } from '@testing-library/react-native';

const mockTypeCascade = jest.fn();

const TypeCascade = ({ onChange, values, id, name, dataSource = [] }) => {
  mockTypeCascade(onChange, values, id, name, dataSource);

  const [dropdownItems, setDropdownItems] = useState([]);

  const groupBy = (array, property) => {
    const gd = array.reduce((groups, item) => {
      const key = item[property];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
    const groupedData = {};
    Object.entries(gd).forEach(([key, value]) => {
      const newKey = key === 'null' ? '0' : key;
      groupedData[newKey] = value;
    });
    return groupedData;
  };

  const handleUpdateItems = (dataItems, index, options) => {
    const updatedItems = dataItems.reduce((accumulator, currentValue, currentIndex) => {
      if (currentIndex === index) {
        accumulator.push({ options });
      } else {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);

    return updatedItems;
  };

  const handleAddItems = (dataItems, options) => {
    return [
      ...dataItems,
      {
        options,
        value: null,
      },
    ];
  };

  const handleSetValues = (dataItems) => {
    const selectedValues = dataItems.map((u) => {
      const findData = dataSource.find((ds) => ds?.id === u.value);
      return findData?.name;
    });

    const stringValue = selectedValues.join('|');
    // call onChange formik
    onChange(id, stringValue);
  };

  const handleOnChange = (index, value) => {
    const nextIndex = index + 1;
    let updatedItems = dropdownItems
      .slice(0, nextIndex)
      .map((d, dx) => (dx === index ? { ...d, value } : d));

    const hasNextItem = updatedItems[nextIndex] || {};
    const hasChildren = hasNextItem?.options?.filter((o) => o?.parent === value)?.length > 0;

    const options = dataSource?.filter((d) => d?.parent === value);

    if (hasChildren) {
      updatedItems = handleUpdateItems(updatedItems, index, options);
    }
    if (!hasChildren) {
      updatedItems = handleAddItems(updatedItems, options);
    }

    handleSetValues(updatedItems);

    setDropdownItems(updatedItems);
  };

  useEffect(() => {
    const filterDs = dataSource.filter(
      (ds) => values[id] === ds?.parent || values[id] === ds?.id || !ds?.parent,
    );
    const groupedDs = groupBy(filterDs, 'parent');
    const findValue = dataSource.find((ds) => ds?.id === values[id]);
    const initialDropdowns = Object.values(groupedDs).map((options) => {
      const initValue =
        options?.find((o) => o?.id === findValue?.parent || o?.id === findValue?.id)?.id || null;
      return {
        options,
        value: initValue,
      };
    });
    setDropdownItems(initialDropdowns);
  }, []);

  return (
    <View testID="view-type-cascade">
      <Text testID="text-values">{values[id] || ''}</Text>
      {dropdownItems.map((item, index) => {
        return (
          <Dropdown
            key={index}
            labelField="name"
            valueField="id"
            testID={`dropdown-cascade-${index}`}
            data={item?.options}
            onChange={({ value }) => handleOnChange(index, value)}
            value={item.value}
          />
        );
      })}
    </View>
  );
};

const dummyLocations = [
  { id: 106, name: 'DI YOGYAKARTA', parent: null },
  { id: 107, name: 'KAB. BANTUL', parent: 106 },
  { id: 113, name: 'KAB. KULON PROGO', parent: 106 },
  { id: 108, name: 'Bendungan', parent: 113 },
  { id: 109, name: 'Sabdodadi', parent: 107 },
  { id: 110, name: 'Bantul', parent: 107 },
  { id: 111, name: 'JAWA TENGAH', parent: null },
  { id: 112, name: 'PURBALINGGA', parent: 111 },
];

describe('TypeCascade', () => {
  it('Should have an initial state with default values or empty dropdowns.', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
    const values = { [fieldID]: initialValue };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });
    const { getByTestId } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={dummyLocations}
      />,
    );
    const txtValuesEl = getByTestId('text-values');
    expect(txtValuesEl).toBeDefined();
    expect(txtValuesEl.props.children).toBe('');
  });

  it('Should have a parent dropdown.', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const initialValue = null;
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

    fireEvent(parentDropdown, 'onChange', { value: 106 });

    const firstOption = getByText('DI YOGYAKARTA');
    expect(firstOption).toBeDefined();
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

  it('Should not show options when the data source is empty.', () => {
    const fieldID = 'location';
    const fieldName = 'Location';
    const selectedOption = 107;
    const values = { [fieldID]: selectedOption };

    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const emptyDataSource = [];

    const { queryByTestId } = render(
      <TypeCascade
        onChange={mockedOnChange}
        id={fieldID}
        name={fieldName}
        values={values}
        dataSource={emptyDataSource}
      />,
    );

    const firstDropdown = queryByTestId('dropdown-cascade-0');
    expect(firstDropdown).toBeNull();
  });

  it('Should update child dropdowns when the selected option in the parent dropdown changes.', () => {
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

    // Change first parent
    fireEvent(firstDropdown, 'onChange', { value: 111 });

    const updatedFirstOption = getByText('JAWA TENGAH');
    expect(updatedFirstOption).toBeDefined();

    const updatedSecondOption = queryByText('KAB. BANTUL');
    expect(updatedSecondOption).toBeNull();

    const thirdNotFound = queryByTestId('dropdown-cascade-2');
    expect(thirdNotFound).toBeNull();
  });
});
