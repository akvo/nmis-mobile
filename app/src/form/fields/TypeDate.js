import React from 'react';
import { View } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { Input } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';

const TypeDate = ({ onChange, values, id, name }) => {
  const now = new Date();
  const [showDatepicker, setShowDatePicker] = React.useState(false);

  return (
    <View style={styles.questionContainer}>
      <FieldLabel label={name} />
      <Input
        inputContainerStyle={styles.inputFieldContainer}
        onPressIn={() => setShowDatePicker(true)}
        showSoftInputOnFocus={false}
        value={values?.[id]?.toLocaleDateString()}
        testID="type-date"
      />
      {showDatepicker && (
        <DateTimePicker
          testID="date-time-picker"
          value={values?.[id] || now}
          mode="date"
          onChange={({ nativeEvent: val }) => {
            setShowDatePicker(false);
            if (onChange) {
              onChange(id, new Date(val.timestamp));
            }
          }}
        />
      )}
    </View>
  );
};

export default TypeDate;
