import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Dialog } from '@rneui/themed';

const LoadingDialog = ({ isVisible = false, loadingText = 'Loading' }) => {
  return (
    <Dialog isVisible={isVisible} style={styles.dialogLoadingContainer}>
      <Dialog.Loading />
      <Text style={styles.dialogLoadingText}>{loadingText}</Text>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialogLoadingContainer: {
    flex: 1,
  },
  dialogLoadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LoadingDialog;
