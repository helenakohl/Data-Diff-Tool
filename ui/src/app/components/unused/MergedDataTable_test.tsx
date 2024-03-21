// import React, { useState } from 'react';
import { DataItem, TableInfo2 } from '../../Interfaces';

const generateKey = (row: DataItem, keys: string[]) => 
keys.map(column => row[column]).join('|');

const mergeData = (data1: DataItem[], data2: DataItem[], commonColumns: string[]) => {
  const processedKeys = new Set();
  const mergedData: DataItem[] = [];

  // Identify all unique columns from both data sets for the merged table structure.
  const allColumns = [...new Set([...Object.keys(data1[0] || {}), ...Object.keys(data2[0] || {})])];

  // First, merge rows from data2, adding missing data from data1 where applicable.
  data2.forEach(row2 => {
    const key2 = generateKey(row2, commonColumns);
    const row1 = data1.find(row1 => generateKey(row1, commonColumns) === key2);

    const newRow: DataItem = {};
    allColumns.forEach(column => {
      // Prefer data from data2; use data1; use "N/A" if in none
      if (row2.hasOwnProperty.call(row2,column)) {
        newRow[column] = row2[column];
      } else if (row1 && row1.hasOwnProperty.call(row1, column)) {
        newRow[column] = row1[column];
      } else {
        newRow[column] = "N/A";
      }
    });

    mergedData.push(newRow);
    processedKeys.add(key2);
  });

  // Then, add unique rows from data1 that weren't processed.
  data1.forEach(row1 => {
    const key1 = generateKey(row1, commonColumns);
    if (!processedKeys.has(key1)) {
      const newRow = allColumns.reduce((acc, column) => ({
        ...acc,
        [column]: row1.hasOwnProperty.call(row1, column) ? row1[column] : "N/A"
      }), {});

      mergedData.push(newRow);
    }
  });

  return mergedData;
};

const MergedDataTable2: React.FC<TableInfo2> = ({ tableNumber1, tableNumber2, data1, data2, missingColumns, addedColumns, missingRows, addedRows, commonColumns, changedTypes }) => {
  // const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const mergedData = mergeData(data1, data2, commonColumns);
  
  // Function to generate table headers
  const generateHeaders = (data: DataItem[]) => {
    if (data.length === 0) return null;
    return Object.keys(data[0]).map((key) => (
      <th key={key} style={missingColumns.includes(key) ? { background: 'salmon' } : changedTypes.includes(key) ? { background: 'yellow' } : addedColumns.includes(key) ? { background: 'lightgreen' } : undefined}>
        {key}
      </th>
    ));
  };
  // set style for chnaged columns and data types
  const getColumnStyle = (columnName: string) => ({
    backgroundColor: addedColumns.includes(columnName) ? 'lightgreen' : changedTypes.includes(columnName) ? 'yellow' : missingColumns.includes(columnName) ? 'salmon' : 'none',
  });

  // Determine if a row is added or removed
  const isRowAdded = (row: DataItem) => {
    const rowKey = generateKey(row, commonColumns);
    return addedRows.some(addedRow => generateKey(addedRow, commonColumns) === rowKey);
  };
  const isRowMissing = (row: DataItem) => {
    const rowKey = generateKey(row, commonColumns);
    return missingRows.some(missingRows => generateKey(missingRows, commonColumns) === rowKey);
  };


  return (
    <div className="tables-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <table>
        {generateHeaders(mergedData)}
        <tbody>
          {mergedData.map((row, index) => {
            return (
              <tr key={index} style={{ backgroundColor: isRowAdded(row) ? 'lightgreen' : isRowMissing(row) ? 'salmon' : 'none' }}>
                {Object.keys(row).map((columnName) => (
                  <td key={columnName} style={getColumnStyle(columnName)}>
                    {row[columnName]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default MergedDataTable2;