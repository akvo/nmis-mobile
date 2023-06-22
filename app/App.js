import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { conn, initialQuery } from './src/database';

const db = conn.init;

const App = () => {
  React.useEffect(() => {
    conn.tx(db, initialQuery());
  }, []);
  return (
    <SafeAreaProvider>
      <Navigation testID="navigation-element" />
    </SafeAreaProvider>
  );
};

export default App;
