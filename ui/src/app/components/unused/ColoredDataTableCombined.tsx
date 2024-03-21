import React, { useState, useEffect } from 'react';
import { DataItem, TableInfo } from '../../Interfaces';

const ColoredTableData: React.FC<TableInfo> = ({ tableNumber1, tableNumber2, missingColumns, addedColumns, missingRows, addedRows, commonColumns }) => {
  const [data1, setData1] = useState<DataItem[]>([]);
  const [data2, setData2] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const response1 = await fetch(`http://localhost:3333/data${tableNumber1}`);
        const jsonData1: DataItem[] = await response1.json();
        setData1(jsonData1);

        const response2 = await fetch(`http://localhost:3333/data${tableNumber2}`);
        const jsonData2: DataItem[] = await response2.json();
        setData2(jsonData2);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, [tableNumber1, tableNumber2]);

  // Columns 
  // Function to generate table headers
  const generateHeaders = (data: DataItem[]) => {
    if (data.length === 0) return null;
    return Object.keys(data[0]).map((key) => (
      <th key={key} style={missingColumns.includes(key) ? { background: 'red' } : addedColumns.includes(key) ? { background: 'lightgreen' } : undefined}>
        {key}
      </th>
    ));
  };

  // Rows 
  const generateKey = (row: DataItem) => 
    commonColumns.map(column => row[column]).join('|');

  // Determine if a row is added or removed
  const isRowAdded = (row: DataItem) => {
    const rowKey = generateKey(row);
    return addedRows.some(addedRow => generateKey(addedRow) === rowKey);
  };

  const isRowRemoved = (row: DataItem) => {
    const rowKey = generateKey(row);
    return missingRows.some(missingRows => generateKey(missingRows) === rowKey);
  };

  if (isLoading) {
    return <div>Comparing...</div>;
  }

  const getColumnStyle = (columnName: string) => {
    if (missingColumns.includes(columnName)) {
      return { background: 'red' };
    } else if (addedColumns.includes(columnName)) {
      return { background: 'lightgreen' };
    }
    return {};
  };


  return (
    <div className="tables-container"style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' }}>
      <table>
        <thead>
          {generateHeaders(data2)}
        </thead>
        <tbody>
          {data1.filter(isRowRemoved).map((row, index) => (
            <tr key={index} style={{ 
              background: isRowAdded(row) ? 'lightgreen' 
              : isRowRemoved(row) ? 'red' 
              : 'transparent' 
            }}>
              {Object.keys(data2[0]).map((columnName, colIndex) => (
                <td key={colIndex} style={getColumnStyle(columnName)}>
                  {row.hasOwnProperty.call(row, columnName) ? String(row[columnName]) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tbody>
          {data2.map((row, index) => (
            <tr key={index} style={{ 
              background: isRowAdded(row) ? 'lightgreen' 
              : isRowRemoved(row) ? 'red' 
              : 'transparent' 
            }}>
              {Object.keys(data2[0]).map((columnName, colIndex) => (
                <td key={colIndex} style={getColumnStyle(columnName)}>
                  {row.hasOwnProperty.call(row, columnName) ? String(row[columnName]) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* New Table for Missing Columns */}
      <table>
        <thead>
          <tr>
            {missingColumns.map((columnName) => (
              <th key={columnName} style={{ background: 'red' }}>
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data1.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {missingColumns.map((columnName, colIndex) => (
                <td key={colIndex} style={{ background: 'red' }}>
                  {row.hasOwnProperty.call(row, columnName) ? String(row[columnName]) : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ColoredTableData;