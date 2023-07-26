import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet } from 'react-native';
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
  subTitle = null,
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
      <View>
        <Text h4Style={styles.title} testID="page-title" h4>
          {text}
        </Text>
        {subTitle && (
          <Text testID="page-subtitle" style={styles.subTitle}>
            {subTitle}
          </Text>
        )}
      </View>
      {!rightComponent && (
        <Button type="clear" testID="more-options-button" onPress={handleSettingsPress}>
          <Icon name="ellipsis-vertical" size={18} />
        </Button>
      )}
    </Header>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  subTitle: {
    fontWeight: 400,
    fontStyle: 'italic',
  },
});

export default PageTitle;
