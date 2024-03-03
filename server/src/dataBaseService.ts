import * as path from 'path';

import Database = require('better-sqlite3');

interface TableColumn {
  name: string; // Column name
  type: string; // Data type of the column
}

const initializeDatabase = (dbName: string) => {
  const db = new Database(
    path.resolve(__dirname, `../../server/database/${dbName}`),
    { verbose: console.log },
  );
  return db;
};

export const getTableData = (dbName: string, tableName: string) => {
  const db = initializeDatabase(dbName);
  const query = db.prepare(`SELECT * FROM ${tableName}`);
  const data = query.all();
  db.close();
  return data;
};

export const getTableColumnInfo = (
  dbName: string,
  tableName: string,
): TableColumn[] => {
  const db = initializeDatabase(dbName);
  const stmt = db.prepare(`PRAGMA table_info(${tableName})`);
  const columnsInfo: TableColumn[] = stmt.all() as TableColumn[];
  const mappedColumnsInfo = columnsInfo.map(({ name, type }) => ({
    name,
    type,
  }));
  db.close();
  return mappedColumnsInfo;
};
