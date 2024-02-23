import * as path from 'path';

import Database = require('better-sqlite3');

const initializeDatabase = (dbName: string) => {
  const db = new Database(
    path.resolve(__dirname, `../../server/database/${dbName}`),
    { verbose: console.log },
  );
  return db;
};

export const getTableData = (dbName: string, tableName: string) => {;
  const db = initializeDatabase(dbName);
  const query = db.prepare(`SELECT * FROM ${tableName}`);
  const data = query.all();
  db.close();
  return data;
};
