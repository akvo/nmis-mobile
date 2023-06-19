import React from 'react';
import { Card, Text } from '@rneui/themed';

export const Summary = ({ amount, description }) => {
  return (
    <Card containerStyle={{ marginLeft: -6 }}>
      <Text h4>{amount}</Text>
      <Text>{description}</Text>
    </Card>
  );
};
