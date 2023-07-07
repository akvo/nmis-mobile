import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

import Navigation from './src/navigation';
import { conn, query, tables } from './src/database';
import { UIState, AuthState, UserState } from './src/store';
import { crudSessions, crudUsers } from './src/database/crud';
import { api } from './src/lib';

const db = conn.init;

const App = () => {
  const handleCheckSession = () => {
    crudSessions.selectLastSession().then((session) => {
      if (!session) {
        return session;
      }
      console.info('Session =>', session);
      api.setToken(session.token)
      // check users exist
      crudUsers
        .selectUsers({ count: false })
        .then((users) => {
          console.info('Users =>', users);
          let page = null;
          if (session && users?.length) {
            page = 'Home';
          }
          if (session && !users?.length) {
            page = 'AddUser';
          }
          return { user: users?.[users?.length - 1], page };
        })
        .then(({ user, page }) => {
          UserState.update((s) => {
            s.id = user.id;
            s.name = user.name;
            s.password = user.password;
          });
          AuthState.update((s) => {
            s.token = session.token;
            s.authenticationCode = session.passcode;
          });
          UIState.update((s) => {
            s.currentPage = page ? page : s.currentPage;
          });
        });
    });
  };

  React.useEffect(() => {
    const queries = tables.map((t) => {
      const queryString = query.initialQuery(t.name, t.fields);
      return conn.tx(db, queryString);
    });
    Promise.all(queries).then(() => {
      handleCheckSession();
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
