import React, { useState, useEffect } from 'react';

interface TableInfo {
  tableNumber: number;
}

interface DataItem {
  [key: string]: unknown; // Adjust this type based on your data's structure
}

const TableData: React.FC<TableInfo> = ({ tableNumber }) => {
  const [data, setData] = useState<DataItem[]>([]);
  
  useEffect(() => {
    // data
    fetch(`http://localhost:3333/data${tableNumber}`)
      .then((response) => response.json())
      .then((jsonData: DataItem[]) => setData(jsonData))
      .catch((error) => console.error('Failed to fetch data:', error));
  }, [tableNumber]);

  // Function to generate table headers
  const generateHeaders = (data: DataItem[]) => {
    if (data.length === 0) return null;
    return Object.keys(data[0]).map((key) => <th key={key}>{key}</th>);
  };

  // Function to generate table rows
  const generateRows = (data: DataItem[]) => {
    return data.map((item, index) => (
      <tr key={index}>
        {Object.values(item).map((value, idx) => <td key={idx}>{String(value)}</td>)}
      </tr>
    ));
  };

  return (
    <div>
      <h2>Data {tableNumber}</h2>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              {generateHeaders(data)}
            </tr>
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

export default TableData;