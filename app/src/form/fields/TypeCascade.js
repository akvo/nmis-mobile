import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FieldLabel } from '../support';
import { styles } from '../styles';

const TypeCascade = ({ onChange, values, keyform, id, name, tooltip, source, dataSource = [] }) => {
  const [dropdownItems, setDropdownItems] = useState([]);

  const groupBy = (array, property) => {
    const gd = array
      .sort((a, b) => a?.name?.localeCompare(b?.name))
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
      groupedData[key] = value;
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
    const dropdownValues = updatedItems.filter((dd) => dd.value).map((dd) => dd.value);
    const finalValues = updatedItems.length !== dropdownValues.length ? null : dropdownValues;
    onChange(id, finalValues);

    setDropdownItems(updatedItems);
  };

  useEffect(() => {
    const parentID = source?.parent_id || 0;
    const filterDs = dataSource.filter(
      (ds) =>
        ds?.parent === parentID ||
        (values[id] && (values[id].includes(ds?.id) || values[id].includes(ds?.parent))),
    );

    if (dropdownItems.length === 0 && dataSource.length && filterDs.length) {
      const groupedDs = groupBy(filterDs, 'parent');
      const initialDropdowns = Object.values(groupedDs).map((options, ox) => {
        return {
          options,
          value: values[id] ? values[id][ox] : null,
        };
      });
      setDropdownItems(initialDropdowns);
    }
  }, [dataSource, dropdownItems, source, values, id]);

  return (
    <View testID="view-type-cascade">
      <FieldLabel keyform={keyform} name={name} tooltip={tooltip} />
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
