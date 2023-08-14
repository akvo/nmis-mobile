import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Dialog } from '@rneui/themed';

const LoadingDialog = ({ isVisible = false, loadingText = null }) => {
  return (
    <Dialog testID="loading-dialog" isVisible={isVisible} style={styles.dialogLoadingContainer}>
      <Dialog.Loading />
      {loadingText && (
        <Text style={styles.dialogLoadingText} testID="loading-dialog-text">
          {loadingText}
        </Text>
      )}
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
