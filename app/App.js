import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

import Navigation from './src/navigation';
import { conn, query, tables } from './src/database';
import { UIState } from './src/store';
import { crudSessions } from './src/database/crud';

const db = conn.init;

const App = () => {
  React.useEffect(() => {
    // check session
    crudSessions.selectLastSession().then((res) => {
      console.info('Session =>', res);
      UIState.update((s) => {
        s.currentPage = res ? 'Home' : s.currentPage;
        s.token = res.token;
        s.authenticationCode = res.passcode
      });
    });
  }, []);

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
