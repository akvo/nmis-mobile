import React from 'react';
import { Tab } from '@rneui/themed';
import { styles } from '../styles';

const FormNavigation = ({
  currentGroup,
  formRef,
  onSubmit,
  activeGroup,
  setActiveGroup,
  totalGroup,
}) => {
  const validateOnFormNavigation = async () => {
    let errors = false;
    if (formRef?.current) {
      const touched = currentGroup?.question?.reduce(
        (res, currentQ) => ({ ...res, [currentQ?.id]: true }),
        {},
      );
      formRef.current.setTouched(touched);
      await formRef.current.validateForm();
      errors = Object.keys(formRef.current.errors)?.length > 0;
    }
    return errors;
  };

  const handleFormNavigation = (index) => {
    validateOnFormNavigation()
      .then((errors) => {
        if (!errors && index === 2 && activeGroup === totalGroup - 1) {
          return onSubmit();
        }
        if (!errors && activeGroup <= totalGroup - 1) {
          const newValue = index === 0 ? activeGroup - 1 : activeGroup + 1;
          return setActiveGroup(newValue < 0 ? 0 : newValue);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Tab
      buttonStyle={styles.formNavigationButton}
      onChange={handleFormNavigation}
      disableIndicator={true}
      value={activeGroup}
    >
      <Tab.Item
        title="Back"
        icon={{ name: 'chevron-back-outline', type: 'ionicon', color: 'grey', size: 20 }}
        iconPosition="left"
        iconContainerStyle={styles.formNavigationIcon}
        titleStyle={styles.formNavigationTitle}
        testID="form-nav-btn-back"
      />
      <Tab.Item
        disabled
        disabledStyle={{ backgroundColor: 'transparent' }}
        title={`${activeGroup + 1}/${totalGroup}`}
        titleStyle={styles.formNavigationTitle}
        testID="form-nav-group-count"
      />
      {activeGroup < totalGroup - 1 ? (
        <Tab.Item
          title="Next"
          icon={{ name: 'chevron-forward-outline', type: 'ionicon', color: 'grey', size: 20 }}
          iconPosition="right"
          iconContainerStyle={styles.formNavigationIcon}
          titleStyle={styles.formNavigationTitle}
          testID="form-nav-btn-next"
        />
      ) : (
        <Tab.Item
          title="Submit"
          icon={{ name: 'paper-plane-outline', type: 'ionicon', color: 'grey', size: 20 }}
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