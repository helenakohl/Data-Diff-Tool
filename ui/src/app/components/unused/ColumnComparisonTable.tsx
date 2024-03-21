import React, { useState, useEffect } from 'react';
import { SelectedValues, ColComparisonResult } from '../../Interfaces';

import ColoredTableData from './ColoredDataTable';

const getColumnNames = (data: never[]): string[] => {
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

/*
function combineData(data1: DataRow[], data2: DataRow[], missingInTable1: string[], addedInTable1: string[], presentInBoth: string[]): DataRow[] {

  const combinedRows: Map<number, DataRow> = new Map();

  // Helper function to merge rows
  const mergeRows = (row: DataRow, source: DataRow[]) => {
    const rowId = row.id as number;
    const existingRow = combinedRows.get(rowId) || {};
    const newRow = { ...existingRow, ...row };

    // Add unique columns from the other table with null values if they don't exist in the current row
    const uniqueColumnsToAdd = source === data1 ? missingInTable1 : addedInTable1;
    uniqueColumnsToAdd.forEach(col => {
      if (newRow[col] === undefined) {
        newRow[col] = null;
      }
    });
    combinedRows.set(rowId, newRow);
    //console.log(uniqueColumnsToAdd);
  };

  // Process each dataset
  data1.forEach(row => mergeRows(row, data1));
  data2.forEach(row => mergeRows(row, data2));

  // Convert Map values to an array
  return Array.from(combinedRows.values());
}
*/

const ColumnComparisonTable: React.FC<SelectedValues> = ({ value1, value2 }) => {
    const [comparisonResult, setComparisonResult] = useState<ColComparisonResult>({
      ColsAddedInTable2: [],
      ColsMissingInTable2: [],
      presentInBoth: []
    });

    useEffect(() => {
        Promise.all([
        fetch(`http://localhost:3333/data${value1}`).then(res => res.json()),
        fetch(`http://localhost:3333/data${value2}`).then(res => res.json()),
        ]).then(([data1, data2]) => {
        const columnsTable1 = getColumnNames(data1);
        const columnsTable2 = getColumnNames(data2);
        //console.log(data1);
        const result = compareColumns(columnsTable1, columnsTable2);
        //const combinedData = combineData(data1, data2, result.missingInTable1, result.addedInTable1, result.presentInBoth)
        setComparisonResult(result);
        }).catch(error => console.error('Failed to fetch data:', error));
    }, [ value1, value2 ]);

    return (
        <div>
        <h2>Table Comparison Results</h2>
        <div>
            <h3>Columns that were added in Table {value2}:</h3>
            <ul>
            {comparisonResult.ColsAddedInTable2.map(column => <li key={column}>{column}</li>)}
            </ul>
        </div>
        <div>
            <h3>Columns that were removed in Table {value2}:</h3>
            <ul>
            {comparisonResult.ColsMissingInTable2.map(column => <li key={column}>{column}</li>)}
            </ul>
        </div>
        <div>
            <h3>Present in both Tables:</h3>
            <ul>
            {comparisonResult.presentInBoth.map(column => <li key={column}>{column}</li>)}
            </ul>
        </div>
          <ColoredTableData tableNumber={value2} missingColumns={comparisonResult.ColsMissingInTable2} addedColumns={comparisonResult.ColsAddedInTable2}/>
        </div>
    );
};
export default ColumnComparisonTable;