import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

import Navigation from './src/navigation';
import { conn, query, tables } from './src/database';
import { AppStore } from './src/store';

const db = conn.init;

const App = () => {
  React.useEffect(() => {
    const queries = tables.map((t) => query.initialQuery(t.name, t.fields)).join(' ');
    conn.tx(db, queries).then((res) => {
      console.log('results', res);
    });
  }, []);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      AppStore.update((s) => {
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
