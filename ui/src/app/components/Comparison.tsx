import React, { useState, useEffect } from 'react';
import { RowComparisonResult, ColComparisonResult, SelectedValues, DataItem } from '../Interfaces';
import MergedDataTable from './MergedDataTable';

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

const Comparison: React.FC<SelectedValues> = ({ value1, value2 }) => {
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

    useEffect(() => {
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
    }, [ value1, value2 ]);

    return (
      <div>
        <MergedDataTable
        tableNumber1 = {value1} 
        tableNumber2={value2} 
        addedColumns={colComparisonResult.ColsAddedInTable2}
        missingColumns={colComparisonResult.ColsMissingInTable2}
        missingRows={rowComparisonResult.RowsMissingInTable2} 
        addedRows={rowComparisonResult.RowsAddedInTable2} 
        commonColumns={rowComparisonResult.commonColumns}/>
      </div>
    );
};
export default Comparison;