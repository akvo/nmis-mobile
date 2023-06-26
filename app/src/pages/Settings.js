import React from 'react';
import { View } from 'react-native';
import { ListItem, Text } from '@rneui/themed';
import { BaseLayout } from '../components';
import { config } from './Settings/config';
const Settings = ({ navigation }) => {
  const goToForm = (id) => {
    const findConfig = config.find((c) => c?.id === id);
    navigation.navigate('SettingsForm', { id, name: `Settings ${findConfig?.name}` });
  };
  const list = config.map((c) => ({ id: c?.id, name: c?.name, description: c?.description }));
  return (
    <BaseLayout title="Settings">
      <BaseLayout.Content>
        <View>
          {list.map((l, i) => (
            <ListItem key={i} onPress={() => goToForm(l.id)} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
                <ListItem.Subtitle>{l.description}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
        </View>
      </BaseLayout.Content>
    </BaseLayout>
  );
};

export default Settings;
