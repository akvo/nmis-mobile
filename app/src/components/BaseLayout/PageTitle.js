import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header, Text, Button } from '@rneui/themed';

const PageTitle = ({ text, back = null }) => {
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
      {back && typeof back === 'function' ? (
        <Button type="clear" onPress={back} testID="arrow-back-button">
          <Icon name="arrow-back" size={18} />
        </Button>
      ) : (
        ''
      )}
      <Text h4Style={{ fontSize: 18 }} h4>
        {text}
      </Text>
      <Button type="clear" testID="more-options-button">
        <Icon name="ellipsis-vertical" size={18} />
      </Button>
    </Header>
  );
};

export default PageTitle;
