import React from 'react';
import { View } from 'react-native';
import { ListItem, Divider } from '@rneui/themed';
import { BaseLayout, LogoutButton } from '../components';
import { config } from './Settings/config';
const Settings = ({ navigation }) => {
  const goToForm = (id) => {
    const findConfig = config.find((c) => c?.id === id);
    navigation.navigate('SettingsForm', { id, name: findConfig?.name });
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
          <Divider width={8} color="#f9fafb" />
          <LogoutButton />
        </View>
      </BaseLayout.Content>
    </BaseLayout>
  );
};

export default Settings;
