import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet } from 'react-native';
import { Input, CheckBox, Button } from '@rneui/themed';
import { CenterLayout, Image } from '../components';

const ToggleEye = ({ hidden, onPress }) => {
  const iconName = hidden ? 'eye' : 'eye-off';
  return (
    <Button type="clear" onPress={onPress} testID="auth-toggle-eye-buton">
      <Icon name={iconName} size={24} />
    </Button>
  );
};

const AuthForm = ({ navigation }) => {
  const [hidden, setHidden] = React.useState(true);
  const [checked, setChecked] = React.useState(false);

  const toggleHidden = () => setHidden(!hidden);
  const goToHome = () => navigation.navigate('Home');

  const titles = ['Use the Enumerator ID', 'provided to you by your', 'project admin'];
  return (
    <CenterLayout>
      <Image />
      <CenterLayout.Titles items={titles} />
      <View style={styles.container}>
        <Input
          placeholder="Enumerator ID"
          secureTextEntry={hidden}
          rightIcon={<ToggleEye hidden={hidden} onPress={toggleHidden} />}
          testID="auth-password-field"
          autoFocus
        />
        <CheckBox
          title="I accept the Terms or Conditions"
          checked={checked}
          onPress={() => setChecked(!checked)}
          containerStyle={styles.checkbox}
          testID="auth-checkbox-field"
        />
      </View>
      <Button title="primary" onPress={goToHome} testID="auth-login-button">
        LOG IN
      </Button>
    </CenterLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  checkbox: {
    backgroundColor: '#f9fafb',
  },
});

export default AuthForm;
