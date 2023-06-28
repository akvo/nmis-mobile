import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Overlay } from '@rneui/themed';
import { BaseLayout } from '../components';
import { conn, query } from '../database';
import { UserState } from '../store';

const db = conn.init;

const Home = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState(null);
  const { id: userID } = UserState.useState((s) => s);

  const hasUser = React.useMemo(() => {
    const table = 'users';
    const id = 1;
    const selectQuery = query.read(table, { id });
    if (!userID && loading) {
      conn.tx(db, selectQuery, [id]).then(({ rows }) => {
        if (rows.length) {
          const userDB = rows._array[0];
          UserState.update((s) => {
            s.id = userDB?.id;
            s.name = userDB?.name;
            s.password = userDB?.password;
          });
        }
        setLoading(false);
      });
    }
    if (userID && loading) {
      setLoading(false);
    }
    return userID;
  }, [userID, loading]);

  React.useEffect(() => {
    if (!hasUser && !loading) {
      navigation.navigate('UserProfile');
    }
  }, [hasUser, loading]);

  const goToFormAction = (id) => {
    const findData = data?.find((d) => d?.id === id);
    navigation.navigate('FormAction', { id, name: findData?.name });
  };

  const data = Array.from({ length: 100 })
    .map((_, dx) => ({
      id: dx,
      name: `Household ${dx + 1}`,
      subtitles: ['Submitted: 20', 'Draft: 1', 'Synced: 11'],
    }))
    .filter((d) => (search && d?.name?.toLowerCase().includes(search.toLowerCase())) || !search);
  return (
    <BaseLayout
      title="Form Lists"
      search={{
        show: true,
        placeholder: 'Search form',
        value: search,
        action: setSearch,
      }}
    >
      <Overlay isVisible={loading}>
        <ActivityIndicator size="large" color="#2089dc" />
      </Overlay>
      <BaseLayout.Content data={data} action={goToFormAction} columns={2} />
    </BaseLayout>
  );
};

export default Home;
