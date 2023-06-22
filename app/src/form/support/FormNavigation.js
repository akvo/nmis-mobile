import React from 'react';
import { Tab } from '@rneui/themed';
import { styles } from '../styles';

const FormNavigation = ({ onSubmit }) => {
  return (
    <Tab
      buttonStyle={styles.formNavigationButton}
      onChange={(e) => {
        // TODO: Change logic when load form
        if (e === 2) {
          return onSubmit();
        }
      }}
      disableIndicator={true}
    >
      <Tab.Item
        title="Back"
        icon={{ name: 'chevron-back-outline', type: 'ionicon', color: 'grey', size: 14 }}
        iconPosition="left"
        iconContainerStyle={styles.formNavigationIcon}
        titleStyle={styles.formNavigationTitle}
      />
      <Tab.Item title="1/1" titleStyle={styles.formNavigationTitle} />
      {/* <Tab.Item
        title="Next"
        icon={{ name: 'chevron-forward-outline', type: 'ionicon', color: 'grey', size: 14 }}
        iconPosition="right"
        iconContainerStyle={styles.formNavigationIcon}
        titleStyle={styles.formNavigationTitle}
      /> */}
      <Tab.Item
        title="Submit"
        icon={{ name: 'paper-plane-outline', type: 'ionicon', color: 'grey', size: 14 }}
        iconPosition="right"
        iconContainerStyle={styles.formNavigationIcon}
        titleStyle={styles.formNavigationTitle}
      />
    </Tab>
  );
};

export default FormNavigation;
