import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FieldLabel } from '../support';
import { styles } from '../styles';

const TypeCascade = ({ onChange, values, keyform, id, name, dataSource = [] }) => {
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

  const handleOnChange = (index, value) => {
    const nextIndex = index + 1;
    let updatedItems = dropdownItems
      .slice(0, nextIndex)
      .map((d, dx) => (dx === index ? { ...d, value } : d));

    const hasNextItem = updatedItems[nextIndex] || {};
    const hasChildren = hasNextItem?.options?.filter((o) => o?.parent === value)?.length > 0;

    const options = dataSource?.filter((d) => d?.parent === value);

    if (options.length) {
      updatedItems = hasChildren
        ? handleUpdateItems(updatedItems, index, options)
        : handleAddItems(updatedItems, options);
    }

    onChange(id, value);

    setDropdownItems(updatedItems);
  };

  useEffect(() => {
    if (!dropdownItems.length && dataSource.length) {
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
    }
  }, [dropdownItems, dataSource]);

  return (
    <View testID="view-type-cascade">
      <FieldLabel keyform={keyform} name={name} />
      <Text testID="text-values" style={styles.cascadeValues}>
        {values[id]}
      </Text>
      <View style={styles.cascadeContainer}>
        {dropdownItems.map((item, index) => {
          return (
            <Dropdown
              key={index}
              labelField="name"
              valueField="id"
              testID={`dropdown-cascade-${index}`}
              data={item?.options}
              onChange={({ id: selectedID }) => handleOnChange(index, selectedID)}
              value={item.value}
              style={[styles.dropdownField]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default TypeCascade;
