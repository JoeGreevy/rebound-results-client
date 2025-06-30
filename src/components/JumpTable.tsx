import { featureNames } from '../assets/featureNames';
import { useState, useEffect } from 'react'

import { mean } from 'mathjs'

interface JumpTableProps {
    selectedId: string;
    columns: string[];
    setColumns: (columns: string[]) => void;
}

function JumpTable({ selectedId, columns, setColumns }: JumpTableProps) {
  // Return a table of jumps for the selected subject
  const [jumpData, setJumpData]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const cols = columns.join("-")


  useEffect(() => {
    setLoading(true);

    fetch(`${import.meta.env.VITE_API}/api/subjects/${selectedId}/${cols}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Jump data:", data);
        setJumpData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching jump data:", err);
        setLoading(false);
      });
  }, [selectedId, columns])

  if (loading) return <div>Loading...</div>;
   
  const keys: string[] = columns; 
  const rowCount = jumpData[keys[0]].length;

  return (
    <>
    <table>
      <thead>
        <tr>
          {keys.map((key, idx) => (
            <th key={idx}>
              <select value={columns[idx]}
                onChange={(e) => {
                  const newColumns = [...columns];
                  newColumns[idx] = e.target.value;
                  setColumns(newColumns);
                  setLoading(true); // Trigger a reload of the data with the new columns
                }} >
                  { Object.keys(featureNames).map((col, colIdx) => (
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
                  setLoading(true); // Trigger a reload of the data with the new column
                }}
              >Add</button>
              
          </th>
          <th><button
                onClick={() => {
                  const newColumns = [...columns];
                  newColumns.pop(); // Remove the last column
                  setColumns(newColumns);
                  setLoading(true); // Trigger a reload of the data with the new column
                }}
              >Remove</button></th>
          
          
          
        </tr>
      </thead>
      <tbody>
        {/*Top Summary Row */}
        <tr key={0}>
          {keys.map((key, idx) => (
            <td key={idx} style={{ border: "1px solid black" }}>
              {mean(jumpData[key])}
            </td>
          ))}
        </tr>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <tr key={rowIndex+1}>
            {keys.map((key, idx) => (
              <td key={idx} style={{ border: "1px solid black" }}>
                {jumpData[key][rowIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  )
}

export default JumpTable;