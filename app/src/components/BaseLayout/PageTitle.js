import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header, Text, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const PageTitle = ({ text }) => {
  const navigation = useNavigation();

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleGoBackPress = () => {
    navigation.goBack();
  };

  const hasPreviousScreen = () => {
    try {
      return navigation.canGoBack();
    } catch {
      return false;
    }
  };

  return (
    <Header
      backgroundColor="#f3f4f6"
      statusBarProps={{
        backgroundColor: '#171717',
      }}
      containerStyle={{
        height: 80,
      }}
      testID="base-layout-page-title"
    >
      {hasPreviousScreen() ? (
        <Button type="clear" onPress={handleGoBackPress} testID="arrow-back-button">
          <Icon name="arrow-back" size={18} />
        </Button>
      ) : (
        ''
      )}
      <Text h4Style={{ fontSize: 18 }} h4>
        {text}
      </Text>
      <Button type="clear" testID="more-options-button" onPress={handleSettingsPress}>
        <Icon name="ellipsis-vertical" size={18} />
      </Button>
    </Header>
  );
};

export default PageTitle;
