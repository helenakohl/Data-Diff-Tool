
import React, { useState, useEffect } from 'react';


interface TableInfo {
  tableNumber: number;
  missingColumns: string[];
  addedColumns: string[];
}

interface DataItem {
  [key: string]: unknown; // Adjust this type based on your data's structure
}

const ColoredTableData: React.FC<TableInfo> = ({ tableNumber, missingColumns, addedColumns }) => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3333/data${tableNumber}`)
      .then((response) => response.json())
      .then((jsonData: DataItem[]) => setData(jsonData))
      .catch((error) => console.error('Failed to fetch data:', error));
  }, [tableNumber, missingColumns, addedColumns]);

  // Function to generate table headers
  const generateHeaders = (data: DataItem[]) => {
    if (data.length === 0) return null;
    return Object.keys(data[0]).map((key) => (
      <th key={key} style={missingColumns.includes(key) ? { color: 'red' } : addedColumns.includes(key) ? { color: 'green' } : undefined}>
        {key}
      </th>
    ));
  };

  // Function to generate table rows
  const generateRows = (data: DataItem[]) => {
    return data.map((item, index) => (
      <tr key={index}>
        {Object.entries(item).map(([key, value], idx) => (
          <td key={idx} style={missingColumns.includes(key) ? { color: 'red' } : addedColumns.includes(key) ? { color: 'green' } : undefined}>
            {String(value)}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div>
      <h2>Data {tableNumber}</h2>
      {data.length > 0 ? (
        <table>
          <thead>
              {generateHeaders(data)}
          </thead>
          <tbody>
            {generateRows(data)}
          </tbody>
        </table>
      ) : (
        <p>Data is loading...</p>
      )}
    </div>
  );
};

export default ColoredTableData;