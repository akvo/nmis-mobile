import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header, Text, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({ navigation }) => {
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

  return hasPreviousScreen ? (
    <Button type="clear" onPress={handleGoBackPress} testID="arrow-back-button">
      <Icon name="arrow-back" size={18} />
    </Button>
  ) : (
    <Text />
  );
};

const PageTitle = ({
  text,
  leftComponent = null,
  leftContainerStyle = {},
  rightComponent = null,
  rightContainerStyle = {},
}) => {
  const navigation = useNavigation();

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <Header
      leftComponent={leftComponent}
      leftContainerStyle={leftContainerStyle}
      rightComponent={rightComponent}
      rightContainerStyle={rightContainerStyle}
      backgroundColor="#f3f4f6"
      statusBarProps={{
        backgroundColor: '#171717',
      }}
      containerStyle={{
        height: 80,
      }}
      testID="base-layout-page-title"
    >
      {!leftComponent && <BackButton navigation={navigation} />}
      <Text h4Style={{ fontSize: 18 }} h4>
        {text}
      </Text>
      {!rightComponent && (
        <Button type="clear" testID="more-options-button" onPress={handleSettingsPress}>
          <Icon name="ellipsis-vertical" size={18} />
        </Button>
      )}
    </Header>
  );
};

export default PageTitle;
