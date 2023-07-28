import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import { ListItem } from '@rneui/themed';
import { BaseLayout } from '../components';

const ManageForm = ({ navigation, route }) => {
  const items = [
    {
      id: 1,
      text: 'New Blank Form',
      icon: 'add',
      goTo: () => navigation.navigate('FormPage', { ...route?.params, newSubmission: true }),
    },
    {
      id: 2,
      text: 'Edit Saved Form',
      icon: 'folder-open',
      goTo: () => navigation.navigate('FormData', { ...route?.params, showSubmitted: false }),
    },
    {
      id: 3,
      text: 'View Submitted',
      icon: 'eye',
      goTo: () => navigation.navigate('FormData', { ...route?.params, showSubmitted: true }),
    },
  ];
  return (
    <BaseLayout title={route?.params?.name}>
      <BaseLayout.Content>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          {items.map((i, ix) => (
            <ListItem key={ix} onPress={() => i.goTo()} testID={`goto-item-${ix}`}>
              <Icon name={i.icon} color="grey" size={18} />
              <ListItem.Content>
                <ListItem.Title>{i.text}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
        </View>
      </BaseLayout.Content>
    </BaseLayout>
  );
};

export default ManageForm;
