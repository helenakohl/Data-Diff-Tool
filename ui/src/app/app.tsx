// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import { Route, Routes, Link } from 'react-router-dom';
import { useState } from 'react';

import TableData from './components/DataTable';
import TableForm from './components/Form';
import Comparison from './components/Comparison';
import ComparisonText from './components/ComparisonText';

import { SelectedValues } from './Interfaces';

export function App() {

  const [selectedValues, setSelectedValues] = useState<SelectedValues>({ value1: 1, value2: 1 });

  const handleFormSubmit = (values: SelectedValues) => {
    setSelectedValues(values);
  };

  return (
    <div>
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/data1">Table 1</Link>
          </li>
          <li>
            <Link to="/data2">Table 2</Link>
          </li>
          <li>
            <Link to="/data3">Table 3</Link>
          </li>
          <li>
            <Link to="/data4">Table 4</Link>
          </li>
        </ul>
      </div>
      <TableForm onSubmit = {handleFormSubmit} />
      <Routes>
        <Route
          path="/"
          element={
            <div>
            </div>
          }
        />
        <Route
          path="/data1"
          element={
            <div>
              <TableData tableNumber={1}/>
            </div>
          }
        />
        <Route
          path="/data2"
          element={
            <div>
              <TableData tableNumber={2}/>
            </div>
          }
        />
        <Route
          path="/data3"
          element={
            <div>
              <TableData tableNumber={3}/>
            </div>
          }
        />
        <Route
          path="/data4"
          element={
            <div>
              <TableData tableNumber={4}/>
            </div>
          }
        />
        <Route
          path="/compare"
          element={
            <div>
              <Comparison value1={selectedValues.value1} value2={selectedValues.value2}/>
            </div>
          }
        />
        <Route
          path="/quickcompare"
          element={
            <div>
              <ComparisonText value1={selectedValues.value1} value2={selectedValues.value2}/>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
