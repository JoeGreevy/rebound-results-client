import { featureNames } from '../assets/featureNames';
import { useState, useEffect } from 'react'

import { mean } from 'mathjs'

interface InterSubjectTableProps {
    results: any;
    features: string[];
    columns: string[];
    setColumns: (columns: string[]) => void;
}

function InterSubjectTable({ results, features, columns, setColumns }: InterSubjectTableProps) {
  // Return a table of jumps for the selected subject
  const [loading, setLoading] = useState(false);
  const feats = features.join("-")
  const ids = Object.keys(results["mean_start"][features[0]])
  console.log(results["mean_start"]["gct"])
  console.log("Columns:", columns)


   
  // const keys: string[] = columns; 
  // const rowCount = jumpData[keys[0]].length;

  return (
    <>
    <table>
      <thead>
        <tr>
          <th>Index</th>
          {columns.map((col, idx) => (
            <th key={idx}>
              <select value={columns[idx]}
                onChange={(e) => {
                  const newColumns = [...columns];
                  newColumns[idx] = e.target.value;
                  setColumns(newColumns);
                  // setLoading(true); // Trigger a reload of the data with the new columns
                }} >
                  { features.map((col, colIdx) => (
                      <option key={colIdx} value={col}>{featureNames[col]}</option>
                  ))}
              </select>
            </th>
          ))}
          <th>
              <button
                onClick={() => {
                  const newColumns = [...columns, "xxx"];
                  console.log("New Columns:", newColumns);
                  setColumns(newColumns);
                  // setLoading(true); // Trigger a reload of the data with the new column
                }}
              >Add</button>
              
          </th>
          <th><button
                onClick={() => {
                  const newColumns = [...columns];
                  newColumns.pop(); // Remove the last column
                  setColumns(newColumns);
                  setLoading(true); // Trigger a reload of the data with the new column
                  console.log("New cols", columns)
                }}
              >Remove</button>
            </th>
          
          
          
        </tr>
      </thead>
      <tbody>
        {/* <tr key={0}>
          {ids.map((key, idx) => (
            <td key={idx} style={{ border: "1px solid black" }}>
              {mean(jumpData[key])}
            </td>
          ))}
        </tr> */}
        { ids.map((id, rowIndex) => (
          <tr key={rowIndex+1}>
            <td>{id}</td>
            {columns.map((col, idx) => (
              <td key={idx}>
                {results["mean_start"][col][id].toFixed(3)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  )
}

export default InterSubjectTable;