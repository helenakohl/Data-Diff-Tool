export interface SelectedValues {
    value1: number;
    value2: number;
}

export interface DataItem {
    [key: string]:  string | number | boolean;
  }

export interface ColComparisonResult {
    ColsAddedInTable2: string[];
    ColsMissingInTable2: string[];
    presentInBoth: string[]
}

export interface RowComparisonResult {
    RowsAddedInTable2: DataItem[];
    RowsMissingInTable2: DataItem[];
    commonColumns: string[]
}

export interface TypeComparisonResult {
    changedTypes: string[];
}

export interface TableInfo {
    tableNumber1: number;
    tableNumber2: number;
    missingRows: DataItem[];
    addedRows: DataItem[];
    missingColumns: string[];
    addedColumns: string[];
    commonColumns: string[];
    changedTypes: string[]
}

export interface FormValues {
    value1: number;
    value2: number;
}
  
export interface FormComponentValues {
    onSubmit: (values: FormValues) => void;
}
