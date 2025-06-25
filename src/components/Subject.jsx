import { featureNames } from '../assets/featureNames.js';
import DownloadButton from './DownloadButton.jsx';
import { useState, useEffect, useMemo } from 'react'

import { mean } from 'mathjs'

function Subject( { selectedId, setSelectedId, ids } ) {
  
  const [mass, setMass] = useState(0);
  useEffect(() => {
    fetch((`https://rebound-results-api.onrender.com/api/${selectedId}/mass`)).then((res) => res.json()).then((data) => {
      setMass(data);
    }).catch(err => console.error("Error fetching mass:", err));
  }, [selectedId]);

  // Columns to display in the table
  const [columns, setColumns] = useState(Object.keys(featureNames).slice(0, 4))

  

  return (
    <>
    <div>
      < SelectSubject setSelectedId={setSelectedId} ids={ids} id={selectedId} />
      <span>Weight: {mass} kg ({(mass*9.81).toFixed(0)} N)</span>
      < DownloadButton selectedId={selectedId} features={columns} mass={mass} />
    </div>
      
      
      {/* Choose Columns */}

      {/* Results Table: Pass the selectedID and the columns to search for */}
      < JumpTable selectedId={selectedId} columns={columns} setColumns={setColumns} />
    </>
  )
}

function SelectSubject({setSelectedId, ids, id}) {
  

  return (
    <select className="selectSubject"
           value={id}
            onChange={e => setSelectedId(e.target.value)}>
        {ids.map((id) => 
          (<option key={id} value={id}>{id}</option>)
        )}
    </select>
  )
}

function JumpTable({ selectedId, columns, setColumns }) {
  // Return a table of jumps for the selected subject
  const [jumpData, setJumpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const cols = columns.join("-")


  useEffect(() => {
    setLoading(true);

    fetch(`https://rebound-results-api.onrender.com/api/subjects/${selectedId}/${cols}`)
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
   
  const keys = columns; 
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

export default Subject;