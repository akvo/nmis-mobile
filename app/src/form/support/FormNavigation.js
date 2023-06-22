import React from 'react';
import { Tab } from '@rneui/themed';
import { styles } from '../styles';

const FormNavigation = ({ onSubmit, activeGroup, setActiveGroup, totalGroup = 2 }) => {
  return (
    <Tab
      buttonStyle={styles.formNavigationButton}
      onChange={(e) => {
        if (e === 2 && activeGroup === totalGroup - 1) {
          return onSubmit();
        }
        if (activeGroup <= totalGroup - 1) {
          const newValue = e === 0 ? activeGroup - 1 : activeGroup + 1;
          return setActiveGroup(newValue < 0 ? 0 : newValue);
        }
      }}
      disableIndicator={true}
      value={activeGroup}
    >
      <Tab.Item
        title="Back"
        icon={{ name: 'chevron-back-outline', type: 'ionicon', color: 'grey', size: 14 }}
        iconPosition="left"
        iconContainerStyle={styles.formNavigationIcon}
        titleStyle={styles.formNavigationTitle}
        testID="form-nav-btn-back"
      />
      <Tab.Item
        disabled
        title={`${activeGroup + 1}/${totalGroup}`}
        titleStyle={styles.formNavigationTitle}
        testID="form-nav-group-count"
      />
      {activeGroup < totalGroup - 1 ? (
        <Tab.Item
          title="Next"
          icon={{ name: 'chevron-forward-outline', type: 'ionicon', color: 'grey', size: 14 }}
          iconPosition="right"
          iconContainerStyle={styles.formNavigationIcon}
          titleStyle={styles.formNavigationTitle}
          testID="form-nav-btn-next"
        />
      ) : (
        <Tab.Item
          title="Submit"
          icon={{ name: 'paper-plane-outline', type: 'ionicon', color: 'grey', size: 14 }}
          iconPosition="right"
          iconContainerStyle={styles.formNavigationIcon}
          titleStyle={styles.formNavigationTitle}
          testID="form-btn-submit"
        />
      )}
    </Tab>
  );
};

export default FormNavigation;
