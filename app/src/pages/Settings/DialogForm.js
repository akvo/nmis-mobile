import React from 'react';
import { Dialog, Input, Slider } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

const DialogForm = ({ onOk, onCancel, showDialog, edit }) => {
  const [value, setValue] = React.useState(0);

  const { type, label, slider, value: defaultValue, options } = edit || {};
  const isPassword = type === 'password' || false;

  return (
    <Dialog isVisible={showDialog}>
      {type === 'slider' && (
        <Slider
          {...slider}
          allowTouchTrack
          onValueChange={setValue}
          trackStyle={{ height: 5, backgroundColor: '#2089dc' }}
          thumbStyle={{ height: 20, width: 20, backgroundColor: '#2089dc' }}
          thumbProps={{
            children: <Icon name="ellipse" size={20} color="#2089dc" />,
          }}
        />
      )}
      {['text', 'number', 'password'].includes(type) && (
        <Input
          placeholder={label}
          secureTextEntry={isPassword}
          onChangeText={setValue}
          defaultValue={defaultValue?.toString()}
        />
      )}
      {type === 'dropdown' && (
        <Dropdown
          data={options}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={label}
          value={value}
          onChange={(item) => {
            setValue(item.value);
          }}
        />
      )}
      <Dialog.Actions>
        <Dialog.Button onPress={() => onOk(value)}>OK</Dialog.Button>
        <Dialog.Button onPress={onCancel}>Cancel</Dialog.Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DialogForm;
