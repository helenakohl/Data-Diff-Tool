import React, { useState, useEffect } from 'react';
import { RowComparisonResult, ColComparisonResult, SelectedValues, DataItem } from '../Interfaces';

//For column comparison
const getColumnNames = (data: DataItem[]): string[] => {
  const columnNames = new Set<string>();
  data.forEach((row) => {
    Object.keys(row).forEach(columnName => {
      columnNames.add(columnName);
    });
  });
  return Array.from(columnNames);
};

const compareColumns = (columnsTable1: string[], columnsTable2: string[]): ColComparisonResult => {
  const ColsAddedInTable2 = columnsTable2.filter((column) => !columnsTable1.includes(column));
  const ColsMissingInTable2 = columnsTable1.filter((column) => !columnsTable2.includes(column));
  const presentInBoth = columnsTable1.filter((column) => columnsTable2.includes(column));
  return {
    ColsAddedInTable2,
    ColsMissingInTable2,
    presentInBoth,
  };
};

// For row comparison
const findCommonColumns = (data1: DataItem[], data2: DataItem[] ): string[] => {
  const columns1 = new Set(Object.keys(data1[0]));
  const columns2 = new Set(Object.keys(data2[0]));
  const presentInBoth = [...columns1].filter(column => columns2.has(column));
  return presentInBoth
};

function generateKey(row: DataItem, commonColumns: string[]): string {
  return commonColumns.map(column => row[column]).join('|');
}

function compareRows(table1: never[], table2: never[], commonColumns: string[]): RowComparisonResult {
  const secondaryKeys1 = new Set(table1.map(row => generateKey(row, commonColumns)));
  const secondaryKeys2 = new Set(table2.map(row => generateKey(row, commonColumns)));
  const RowsMissingInTable2 = table1.filter(row => !secondaryKeys2.has(generateKey(row, commonColumns)));
  const RowsAddedInTable2 = table2.filter(row => !secondaryKeys1.has(generateKey(row, commonColumns)));
  return {
    RowsAddedInTable2,
    RowsMissingInTable2, 
    commonColumns
  };
}

// Data Type Comparison
function compareTypes(columnsInfo1: { name: string; type: string }[], columnsInfo2: { name: string; type: string }[]): string[] {
  const changedTypes: string[] = [];

  const typeMap = new Map(columnsInfo2.map(column => [column.name, column.type]));

  columnsInfo1.forEach(column1 => {
    const typeInData2 = typeMap.get(column1.name);
    // Check if the column exists in data2 and has a different type
    if (typeInData2 && column1.type !== typeInData2) {
      changedTypes.push(column1.name);
    }
  });

  return changedTypes;
}

const ComparisonText: React.FC<SelectedValues> = ({ value1, value2 }) => {
    const [colComparisonResult, setColComparisonResult] = useState<ColComparisonResult>({
      ColsAddedInTable2: [],
      ColsMissingInTable2: [],
      presentInBoth: [],
    });
    const [rowComparisonResult, setRowComparisonResult] = useState<RowComparisonResult>({
      RowsAddedInTable2: [],
      RowsMissingInTable2: [],
      commonColumns: []
    });
    const [columnsInfo1, setColumnsInfo1] = useState<{ name: string; type: string }[]>([]);
    const [columnsInfo2, setColumnsInfo2] = useState<{ name: string; type: string }[]>([]);
    const [typeComparisonResult, setTypeComparisonResult] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    useEffect(() => {
      setIsLoading(true); // Start loading
        Promise.all([
        fetch(`http://localhost:3333/data${value1}`).then(res => res.json()),
        fetch(`http://localhost:3333/data${value2}`).then(res => res.json()),
        ]).then(([data1, data2]) => {

          // Column comparison
          const columnsTable1 = getColumnNames(data1);
          const columnsTable2 = getColumnNames(data2);
          const colResult = compareColumns(columnsTable1, columnsTable2);
          setColComparisonResult(colResult);

          // Row comparison
          const keys = findCommonColumns(data1, data2);
          const rowResult = compareRows(data1, data2, keys);
          setRowComparisonResult(rowResult);
        }).catch(error => console.error('Failed to fetch data:', error));

        // Type comparison
        fetch(`http://localhost:3333/columnsinfo${value1}`)
        .then(response => response.json())
        .then((jsonInfo: { name: string; type: string }[]) => {
          setColumnsInfo1(jsonInfo); 
        })
        .catch(error => console.error('Failed to fetch column info:', error));

        fetch(`http://localhost:3333/columnsinfo${value2}`)
        .then(response => response.json())
        .then((jsonInfo: { name: string; type: string }[]) => {
          setColumnsInfo2(jsonInfo); 
        })
        .catch(error => console.error('Failed to fetch column info:', error));

        const typeResult = compareTypes(columnsInfo1, columnsInfo2);
        setTypeComparisonResult(typeResult);

        setIsLoading(false);
        
  }, [ value1, value2, columnsInfo1, columnsInfo2 ]);

  if (isLoading) {
    return <div>Comparing...</div>;
  }

  return (
    <div>
      <h3>Changes in Columns: </h3>
      <p>added: {colComparisonResult.ColsAddedInTable2}</p>
      <p>removed: {colComparisonResult.ColsMissingInTable2}</p>
      <p>Data type changed: {typeComparisonResult}</p>
      <h3>Changes in Rows: </h3> 
      <p>Number of added rows: {rowComparisonResult.RowsAddedInTable2.length}</p>
      <p>Number of removed rows: {rowComparisonResult.RowsMissingInTable2.length}</p>
    </div>
  );
};
export default ComparisonText;