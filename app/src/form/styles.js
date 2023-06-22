import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  fieldLabel: {
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 8,
    fontWeight: 600,
    fontSize: 14,
  },
  dropdownField: {
    marginLeft: 10,
    marginRight: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  dropdownSelectedList: {
    marginLeft: 10,
    marginRight: 0,
  },
  formNavigationButton: {
    borderTopColor: 'grey',
    borderTopWidth: 0.5,
  },
  formNavigationIcon: {
    paddingTop: 9,
  },
  formNavigationTitle: {
    paddingTop: 9,
    color: 'grey',
    fontWeight: 'normal',
    fontSize: 14,
    marginRight: -10,
    marginLeft: -10,
  },
});
