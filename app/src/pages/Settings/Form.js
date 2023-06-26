import React from 'react';
import { View } from 'react-native';
import { ListItem, Switch, Button, Input, Dialog } from '@rneui/themed';
import { BaseLayout } from '../../components';
import { config } from './config';
// import { AuthStore } from '../../store';

const SettingsForm = ({ route }) => {
  const [edit, setEdit] = React.useState(false);

  const findConfig = config.find((c) => c?.id === route?.params.id);
  const list = findConfig ? findConfig.fields : [];
  const inputTypes = ['text', 'number', 'password', 'date', 'option'];
  return (
    <BaseLayout title={route?.params?.name}>
      <BaseLayout.Content>
        <View>
          {list.map((l, i) =>
            inputTypes.includes(l.type) ? (
              <ListItem key={i} onPress={() => setEdit(!edit)} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{l.label}</ListItem.Title>
                  <ListItem.Subtitle>{l.description}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ) : (
              <ListItem key={i} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{l.label}</ListItem.Title>
                  <ListItem.Subtitle>{l.description}</ListItem.Subtitle>
                </ListItem.Content>
                {l.type === 'switch' && <Switch />}
              </ListItem>
            ),
          )}
        </View>
        <Dialog isVisible={edit}>
          <Input placeholder="Edit" />
          <View
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }}
          >
            <Button type="clear" onPress={() => setEdit(!edit)}>
              Cancel
            </Button>
            <Button>OK</Button>
          </View>
        </Dialog>
      </BaseLayout.Content>
    </BaseLayout>
  );
};

export default SettingsForm;
