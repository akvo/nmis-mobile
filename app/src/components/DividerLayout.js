import React from 'react';
import { StyleSheet, View } from 'react-native';

const DividerLayout = ({ children, searchBar = false, list = [], listTitle = null }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>Hello</View>
      <View style={styles.bottomSection}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topSection: {
    flex: 1,
    backgroundColor: 'rgb(229 231 235)',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'rgb(209 213 219)',
  },
});
export default DividerLayout;
