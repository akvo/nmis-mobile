import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FieldLabel } from '../support';
import { styles } from '../styles';

const TypeCascade = ({ onChange, values, keyform, id, name, source, dataSource = [] }) => {
  const [dropdownItems, setDropdownItems] = useState([]);

  const groupBy = (array, property) => {
    const gd = array
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
      .reduce((groups, item) => {
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

  const handleOnChange = (index, value) => {
    const nextIndex = index + 1;
    const updatedItems = dropdownItems
      .slice(0, nextIndex)
      .map((d, dx) => (dx === index ? { ...d, value } : d));

    const options = dataSource?.filter((d) => d?.parent === value);

    if (options.length) {
      updatedItems.push({
        options,
        value: null,
      });
    }

    onChange(id, value);

    setDropdownItems(updatedItems);
  };
  const fetchDropdowns = useCallback(async () => {
    if (!dropdownItems.length && dataSource.length) {
      const parentID = source?.parent_id || 0;
      const filterDs = dataSource.filter((ds) => ds?.parent === parentID);
      const groupedDs = groupBy(filterDs, 'parent');
      const initialDropdowns = Object.values(groupedDs).map((options) => {
        const initValue = values[id] || null;
        return {
          options,
          value: initValue,
        };
      });
      setDropdownItems(initialDropdowns);
    }
  }, [dataSource, dropdownItems, source]);
  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

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
