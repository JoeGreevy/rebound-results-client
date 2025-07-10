import { featureNames } from '../assets/featureNames';
import { useState, useEffect } from 'react'

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';

import { mean } from 'mathjs'

import { jumpTree } from '../assets/trees';
import FeatureDropdown from './FeatureDropdown.jsx';

import { Feature } from '../assets/types';

import { keyLookup } from '../assets/featureLookup';



interface JumpTableProps {
    data: any;
    id: string;
    date: string;
    pro: string;
    columns: Feature[];
    setColumns: (columns: Feature[]) => void;
}
import { Condition, Row, RowVal } from '../assets/types';
import { Tab } from '@mui/material';

function JumpTable({ data, id, date, pro, columns, setColumns }: JumpTableProps) {
  // Return a table of jumps for the selected subject
  const [loading, setLoading] = useState(false);
  const cols = columns.join("--")

  // Ordering
  // const [orderBy, setOrderBy] = useState(columns[0].key);
  // const [orderByCondition, setOrderByCondition] = useState<Condition>("start");
  // const [order, setOrder] = useState("desc");
  const rowCount = data[date][pro]["rsi"].length;
  
  let rows:any = [];
  //console.log(data[date][pro]);
  rows = Array.from({length: rowCount}).map((_, idx: number) => {
    return {
      idx: idx,
      vals: columns.map((col: Feature) => {
        //console.log("Col Key:", col.key);
        return data[date][pro][col.key][idx];
      })
      }
  });
  
  
  function changeCols(index:number, feat: Feature){
    const newColumns = [...columns];
    newColumns[index] = feat;
    setColumns(newColumns);
  }
  



  if (loading) return <div>Loading...</div>;
  
  
  //console.log(Object.keys(data[date][pro]["rsi"]).length);
  //return <div>Loading...</div>;
  return (
    <>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Index</TableCell>
          {columns.map((feat, idx) => (
            <TableCell key={idx}>
              <FeatureDropdown key={idx} tree={jumpTree} feature={feat} setter={(feat:Feature) => changeCols(idx, feat)}/>
              {/* <select value={columns[idx].name}
                onChange={(e) => {
                  const newColumns = [...columns];
                  newColumns[idx] = e.target.value;
                  setColumns(newColumns);
                  setLoading(true); // Trigger a reload of the data with the new columns
                }} >
                  { Object.keys(featureNames).map((col, colIdx) => (
                      <option key={colIdx} value={col}>{featureNames[col]}</option>
                  ))}
              </select> */}
            </TableCell>
          ))}
          <TableCell>
              <button
                onClick={() => {
                  const newColumns = [...columns, keyLookup("rsi")];
                  console.log("New Columns:", newColumns);
                  setColumns(newColumns);
                  //setLoading(true); // Trigger a reload of the data with the new column
                }}
              >Add</button>
              
          </TableCell>
          <TableCell>
            <button
                onClick={() => {
                  const newColumns = [...columns];
                  newColumns.pop(); // Remove the last column
                  setColumns(newColumns);
                  //setLoading(true); // Trigger a reload of the data with the new column
                }}
              >Remove</button>
          </TableCell>

          
          
          
        </TableRow>
      </TableHead>
      <TableBody>
        {/*Top Summary Row */}
        {/* <tr key={0}>
          {keys.map((key, idx) => (
            <td key={idx} style={{ border: "1px solid black" }}>
              {mean(jumpData[key])}
            </td>
          ))}
        </tr> */}
        {rows.map((row: any, idx: number) => {
          return (
            <TableRow key={idx}>
              <TableCell>{row.idx}</TableCell>
              {row.vals.map((val: number, valIdx: number) => {
                  return (
                    <TableCell key={valIdx}>
                      {val.toFixed(3)}
                    </TableCell>
                  );
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
    </>
  )
}

export default JumpTable;