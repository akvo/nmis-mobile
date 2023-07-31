import React, { useState } from 'react';
import { View } from 'react-native';
import { ListItem, Divider } from '@rneui/themed';

import { BaseLayout, LogoutButton } from '../components';
import DialogForm from './Settings/DialogForm';
import { config, langConfig } from './Settings/config';
import { UIState } from '../store';
import { i18n } from '../lib';

const Settings = ({ navigation }) => {
  const [showLang, setShowLang] = useState(false);
  const activeLang = UIState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);
  const nonEnglish = activeLang !== 'en';

  const handleSaveLang = (value) => {
    UIState.update((s) => {
      s.lang = value;
    });
    setShowLang(false);
  };

  const goToForm = (id) => {
    const findConfig = config.find((c) => c?.id === id);
    navigation.navigate('SettingsForm', { id, name: findConfig?.name });
  };

  return (
    <BaseLayout title={trans.settingsPageTitle} rightComponent={false}>
      <BaseLayout.Content>
        <View>
          <ListItem onPress={() => setShowLang(true)} testID="settings-lang" bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{trans.langTitle}</ListItem.Title>
              <ListItem.Subtitle>{activeLang}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <Divider width={8} color="#f9fafb" />
          {config.map((c, i) => {
            const itemTitle = nonEnglish ? i18n.transform(activeLang, c)?.name : c.name;
            const itemDesc = nonEnglish
              ? i18n.transform(activeLang, c?.description)?.name
              : c?.description?.name;
            return (
              <ListItem
                key={i}
                onPress={() => goToForm(c.id)}
                testID={`goto-settings-form-${i}`}
                bottomDivider
              >
                <ListItem.Content>
                  <ListItem.Title>{itemTitle}</ListItem.Title>
                  <ListItem.Subtitle>{itemDesc}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            );
          })}
          <LogoutButton />
          <DialogForm
            onOk={handleSaveLang}
            onCancel={() => setShowLang(false)}
            showDialog={showLang}
            edit={langConfig}
          />
        </View>
      </BaseLayout.Content>
    </BaseLayout>
  );
};

export default Settings;
