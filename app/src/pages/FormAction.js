import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import { ListItem } from '@rneui/themed';
import { BaseLayout } from '../components';

const FormAction = ({ navigation, route }) => {
  const goBack = () => {
    navigation.navigate('Home');
  };

  const goToData = () => {
    navigation.navigate('FormData', { ...route?.params });
  };

  const items = [
    {
      id: 1,
      text: 'New Blank Form',
      icon: 'add',
    },
    {
      id: 2,
      text: 'Edit Saved Form',
      icon: 'folder-open',
    },
    {
      id: 3,
      text: 'View Submitted',
      icon: 'eye',
    },
  ];
  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <BaseLayout.Content>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          {items.map((i, ix) => (
            <ListItem key={ix} onPress={goToData}>
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

export default FormAction;