
import React, { useState, useEffect } from 'react';
import { DataItem } from '../../Interfaces';

interface TableInfo2 {
  tableNumber1: number;
  tableNumber2: number;
  missingRows: DataItem[];
  addedRows: DataItem[];
  commonColumns: string[]
}


const ColoredTableData2: React.FC<TableInfo2> = ({ tableNumber1, tableNumber2, missingRows, addedRows, commonColumns }) => {
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

  const generateKey = (row: DataItem) => 
    commonColumns.map(column => row[column]).join('|');

  // Determine if a row is added
  const isRowAdded = (row: DataItem) => {
    const rowKey = generateKey(row);
    return addedRows.some(addedRow => generateKey(addedRow) === rowKey);
  };
  console.log(addedRows);

  // Determine if a row is removed
  const isRowRemoved = (row: DataItem) => {
    const rowKey = generateKey(row);
    return missingRows.some(missingRows => generateKey(missingRows) === rowKey);
  };

  if (isLoading) {
    return <div>Comparing...</div>;
  }

  return (
    <div>
      <table>
        <thead>
          {/* Render table headers */}
        </thead>
        <tbody>
          {data1.filter(isRowRemoved).map((row, index) => (
            <tr key={index} style={{ 
              background: isRowAdded(row) ? 'lightgreen' : isRowRemoved(row) ? 'red' : 'transparent' 
            }}>
              {/* Render the cells for each row */}
              {Object.keys(row).map((cell, idx) => (
                <td key={idx}>{String(row[cell])}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tbody>
          {data2.map((row, index) => (
            <tr key={index} style={{ 
              background: isRowAdded(row) ? 'lightgreen' : isRowRemoved(row) ? 'red' : 'transparent' 
            }}>
              {/* Render the cells for each row */}
              {Object.keys(row).map((cell, idx) => (
                <td key={idx}>{String(row[cell])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ColoredTableData2;