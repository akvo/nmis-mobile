import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

import Navigation from './src/navigation';
import { conn, query, tables } from './src/database';
import { UIState } from './src/store';

const db = conn.init;

const App = () => {
  React.useEffect(() => {
    const queries = tables.map((t) => {
      const queryString = query.initialQuery(t.name, t.fields);
      return conn.tx(db, queryString);
    });
    Promise.all(queries);
  }, []);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      UIState.update((s) => {
        s.online = state.isConnected;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <SafeAreaProvider>
      <Navigation testID="navigation-element" />
    </SafeAreaProvider>
  );
};

export default App;
