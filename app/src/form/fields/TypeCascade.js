import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { FieldLabel } from '../support';
import { styles } from '../styles';
import { conn, query } from '../../database';

const TypeCascade = ({ onChange, values, keyform, id, name }) => {
  const loadAdministrations = async () => {
    const dbFile = require('../../assets/administrations.db');
    const db = await conn.fs(dbFile, 'administrations');
    const selectQuery = query.read('nodes');
    conn.tx(db, selectQuery, []).then(({ rows }) => {
      if (rows.length) {
        console.log('adm', rows._array[0]);
      }
    });
  };
  useEffect(() => {
    loadAdministrations();
  }, []);
  return (
    <View>
      <FieldLabel keyform={keyform} name={name} />
      <Text h4>Cascade here</Text>
    </View>
  );
};

export default TypeCascade;
