import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { conn, query, tables } from './src/database';

const db = conn.init;

const App = () => {
  React.useEffect(() => {
    const queries = tables.map((t) => query.initialQuery(t.name, t.fields)).join(' ');
    conn.tx(db, queries).then((res) => {
      console.log('results', res);
    });
  }, []);
  return (
    <SafeAreaProvider>
      <Navigation testID="navigation-element" />
    </SafeAreaProvider>
  );
};

export default App;
