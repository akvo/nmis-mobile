import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button } from 'react-native';
import { openDatabase, createExampleTable, addExample, getAllExamples } from './src/database';

const db = openDatabase();

function useForceUpdate() {
  const [value, setValue] = React.useState(0);
  return [() => setValue(value + 1), value];
}

const App = () => {
  const [text, onChangeText] = React.useState('Testing');
  const [number, onChangeNumber] = React.useState('');
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(createExampleTable);
    });
  }, []);

  const handleOnAdd = () => {
    if (text === null || text === '') {
      return false;
    }
    db.transaction(
      (tx) => {
        tx.executeSql(addExample, [text, number, JSON.stringify(['Devin', 'Dan', 'Dominic'])]);
        tx.executeSql(getAllExamples, [], (_, { rows }) =>
          console.log('examples: ', JSON.stringify(rows)),
        );
      },
      null,
      forceUpdate,
    );
  };

  return (
    <SafeAreaView>
      <TextInput style={styles.input} onChangeText={onChangeText} value={text} testID="inputText" />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="Please Input"
        keyboardType="numeric"
        testID="inputNumber"
      />
      <Button
        onPress={handleOnAdd}
        title="Add"
        color="#841584"
        accessibilityLabel="Add new example"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;
