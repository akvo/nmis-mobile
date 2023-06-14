import { Platform } from 'react-native';
import { Text } from '@rneui/themed';

const Title = (props) => {
  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontFamily: Platform.select({
            default: 'Courier',
            ios: 'Courier New',
            android: 'monospace',
          }),
          fontWeight: '500',
        },
      ]}
    />
  );
};

export default Title;
