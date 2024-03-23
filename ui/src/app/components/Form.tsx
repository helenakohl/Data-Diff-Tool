import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormComponentValues } from '../Interfaces';

const TableForm: React.FC<FormComponentValues> = ({ onSubmit }) => {
  const [value1, setValue1] = useState<number>(1);
  const [value2, setValue2] = useState<number>(1);
  const navigate = useNavigate(); 

  const handleCompare = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ value1, value2 });
    navigate('compare');
  };

  const handleQuickCompare = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); 
    onSubmit({ value1, value2 }); 
    navigate('/quickcompare'); 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '40px'}}>
      <form onSubmit={handleCompare} style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
          <label>Table 1: </label>
          <select value={value1} onChange={(e) => setValue1(Number(e.target.value))} style={{ marginRight: '10px' }}>
              <option value="1">Table 1</option>
              <option value="2">Table 2</option>
              <option value="3">Table 3</option>
              <option value="4">Table 4</option>
              <option value="5">Table 5</option>
          </select>
          <br/>
          <label>Table 2: </label>
          <select value={value2} onChange={(e) => setValue2(Number(e.target.value))} style={{ marginRight: '10px' }}>
              <option value="1">Table 1</option>
              <option value="2">Table 2</option>
              <option value="3">Table 3</option>
              <option value="4">Table 4</option>
              <option value="5">Table 5</option>
          </select>
          <br/>
          <input type="submit" value="Compare" style={{
            cursor: 'pointer',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            background: 'grey',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}/> 
          <button onClick={handleQuickCompare} style={{
            cursor: 'pointer',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            background: 'grey',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
        }}>Quick Compare</button>
      </form>
    </div>
  );
};

export default TableForm;