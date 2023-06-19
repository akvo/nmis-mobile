import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import { Button } from '@rneui/themed';

export const Control = ({ prev, next, index = 0, isEndReached = false }) => {
  const enabledColor = '#171717';
  const disabledColor = '#9ca3af';
  const isTheStart = index === 0;
  const prevColor = isTheStart ? disabledColor : enabledColor;
  const nextColor = isEndReached ? disabledColor : enabledColor;
  return (
    <View style={{ display: 'flex', flexDirection: 'row', width: '50%' }}>
      <Button type="clear" onPress={prev} disabled={isTheStart}>
        <Icon name="arrow-back" size={24} color={prevColor} />
      </Button>
      <Button type="clear" onPress={next} disabled={isEndReached}>
        <Icon name="arrow-forward" size={24} color={nextColor} />
      </Button>
    </View>
  );
};
