
import React, { useState, useEffect } from 'react';

const TableData = ({ tableNumber }: { tableNumber: number }) => {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3333/data${tableNumber}`)
      .then((response) => response.json())
      .then((jsonData) => {
        // Convert the JSON object to a string to display it
        setData(JSON.stringify(jsonData, null, 2)); 
      })
      .catch((error) => console.error('Failed to fetch data:', error));
  });

  return (
    <div>
      <h2>Data {tableNumber}</h2>
      <pre>{data}</pre>
    </div>
  );
};

export default TableData;