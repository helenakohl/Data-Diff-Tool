import React, { useState, useEffect } from 'react';
import { RowComparisonResult, SelectedValues, DataItem } from '../../Interfaces';
import ColoredTableData2 from './ColoredDataTableTest';


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

const RowComparisonTable: React.FC<SelectedValues> = ({ value1, value2 }) => {
    const [comparisonResult, setComparisonResult] = useState<RowComparisonResult>({
      RowsAddedInTable2: [],
      RowsMissingInTable2: [],
      commonColumns: []
    });

    useEffect(() => {
        Promise.all([
        fetch(`http://localhost:3333/data${value1}`).then(res => res.json()),
        fetch(`http://localhost:3333/data${value2}`).then(res => res.json()),
        ]).then(([data1, data2]) => {

        const keys = findCommonColumns(data1, data2);
        const result = compareRows(data1, data2, keys);
    
        setComparisonResult(result);
        console.log(result);

        }).catch(error => console.error('Failed to fetch data:', error));
    }, [ value1, value2 ]);

    return (
      <div>
        <ColoredTableData2 tableNumber1 = {value1} tableNumber2={value2} missingRows={comparisonResult.RowsMissingInTable2} addedRows={comparisonResult.RowsAddedInTable2} commonColumns={comparisonResult.commonColumns}/>
      </div>
    );
};
export default RowComparisonTable;