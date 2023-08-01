import React, { useState, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { FormState, UIState } from '../../store';
import { i18n } from '../../lib';

const TypeCascade = ({
  onChange,
  values,
  keyform,
  id,
  name,
  tooltip,
  required,
  requiredSign,
  source,
  dataSource = [],
}) => {
  const [dropdownItems, setDropdownItems] = useState([]);
  const activeLang = UIState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);

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
    const dropdownValues = updatedItems.filter((dd) => dd.value);
    const finalValues =
      updatedItems.length !== dropdownValues.length ? null : dropdownValues.map((dd) => dd.value);
    onChange(id, finalValues);
    if (finalValues) {
      const { options: selectedOptions, value: selectedValue } = dropdownValues.pop();
      const findSelected = selectedOptions?.find((o) => o.id === selectedValue) || [];
      const cascadeName = findSelected?.name || null;
      FormState.update((s) => {
        s.dataPointName = s.dataPointName.map((dn) =>
          dn.type === 'cascade' ? { ...dn, value: cascadeName } : dn,
        );
      });
    }
    setDropdownItems(updatedItems);
  };

  const initialDropdowns = useMemo(() => {
    const parentID = source?.parent_id || 0;
    let filterDs = dataSource.filter(
      (ds) =>
        ds?.parent === parentID || values[id]?.includes(ds?.id) || values[id]?.includes(ds?.parent),
    );
    if (filterDs.length === 0) {
      filterDs = dataSource.filter((ds) => ds?.id === parentID);
    }
    const groupedDs = groupBy(filterDs, 'parent');
    return Object.values(groupedDs).map((options, ox) => {
      return {
        options,
        value: values[id] ? values[id][ox] : null,
      };
    });
  }, [dataSource, source, values, id]);

  useEffect(() => {
    if (dropdownItems.length === 0 && initialDropdowns.length) {
      setDropdownItems(initialDropdowns);
    }
  }, [dropdownItems, initialDropdowns]);

  return (
    <View testID="view-type-cascade">
      <FieldLabel
        keyform={keyform}
        name={name}
        tooltip={tooltip}
        requiredSign={required ? requiredSign : null}
      />
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
              placeholder={trans.selectItem}
            />
          );
        })}
      </View>
    </View>
  );
};

export default TypeCascade;
