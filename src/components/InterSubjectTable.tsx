import { featureNames } from '../assets/featureNames';
import { useState, useEffect, useMemo } from 'react'
import FeatureDropdown from './FeatureDropdown';
import { Feature } from '../assets/types';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';

// Checkboxes
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';


import { visuallyHidden } from '@mui/utils';
import { e } from 'mathjs';
import { interSubjectTree } from '../assets/trees';
import { keyLookup } from '../assets/featureLookup';

interface InterSubjectTableProps {
    results: any;
    features: Feature[];
    columns: Feature[];
    setColumns: (columns: Feature[]) => void;
}

import { Condition, Row, RowVal } from '../assets/types';

function InterSubjectTable({ results, features, columns, setColumns }: InterSubjectTableProps) {
  // Return a table of jumps for the selected subject
  const [loading, setLoading] = useState(false);
  const feats = features.join("-")
  const ids = Object.keys(results["mean_start"][features[0].key])
  
  const [orderBy, setOrderBy] = useState(columns[0].key);
  const [orderByCondition, setOrderByCondition] = useState<Condition>("start");
  const [order, setOrder] = useState("desc");

  const [showDevs, setShowDevs] = useState(false);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string, condition:Condition, dir:string) => { 
    setOrderBy(property);
    setOrderByCondition(condition)
    setOrder(dir);
  }
   
  // const keys: string[] = columns; 
  // const rowCount = jumpData[keys[0]].length;
  const createSortHandler =
    (property: string, condition: Condition, dir:string) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property, condition,  dir);
    };
  
  const conditionNames: Condition[] = ["start", "end"];
  const [conditions, setConditions] = useState<boolean[]>([true, false]);
  
  
  const rows: Row[] = ids.map((id) => {
      return {
        id: id,
        vals: columns.flatMap((col) => {
          return conditionNames.filter((_, condIdx) => conditions[condIdx]).map((condition) =>{
            const df_key = `mean_${condition}`;
            return {
              key: col.key,
              val: results[df_key][col.key][id],
              std: results[`std_${condition}`][col.key][id],
              condition: condition
            };
          });
        }),
      }
  });

  const sortedRows = rows.sort((a, b) => {
    let aVal = a.vals.find(val => val.key === orderBy && val.condition === orderByCondition)?.val;
    let bVal = b.vals.find(val => val.key === orderBy && val.condition === orderByCondition)?.val;
    if (orderBy === "id") {
      aVal = Number(a.id.slice(-3));
      bVal = Number(b.id.slice(-3));
    }
    if (aVal === undefined || bVal === undefined) {
      return 0; // If the value is not found, treat them as equal
    }else if(aVal < bVal){
      if (order === "asc"){
        return -1; // aVal is less than bVal
      }else{
        return 1; // aVal is less than bVal
      }
    } else if (aVal > bVal) {
      if (order === "asc"){
        return 1; // aVal is greater than bVal
      }else{
        return -1; // aVal is greater than bVal
      }
    } else {
      return 0; // aVal is equal to bVal
    }
  })

  function changeCols(index:number, feat: Feature){
    const newColumns = [...columns];
    newColumns[index] = feat;
    setColumns(newColumns);
  }
  

  function renderHCell(col: Feature, idx: number) {
    // Subtracted -1 at call because table includes ID column
    
      return (
        <FeatureDropdown key={idx} tree={interSubjectTree} feature={col} setter={(feat:Feature) => changeCols(idx, feat)}/>
        // <select value={col.name}
        //   onChange={(e) => {
        //     const newColumns = [...columns];
        //     newColumns[idx] = e.target.value;
        //     setColumns(newColumns);
        //     // setLoading(true); // Trigger a reload of the data with the new columns
        //   }} >
        //     { features.map((col, colIdx) => (
        //         <option key={colIdx} value={col}>{featureNames[col]}</option>
        //     ))}
        // </select>
      )
    }


  const styleObj = {
    '& .MuiTableSortLabel-icon': {
      opacity: 0.5,
      color: 'gray',
      margin: '0'
    },
    '&.Mui-active .MuiTableSortLabel-icon' : {
      opacity: 1,
      color: 'black',
    }
  }

  function condUpdate(idx: number) {
    const newConditions = [...conditions];
    newConditions[idx] = !newConditions[idx];
    setConditions(newConditions);
  }

  const cellStyle = {
    border: "1px solid black",
  }
  

  return (
    <>
    <div className="table-controls">
      <FormGroup row={true}>
        <FormControlLabel control={<Checkbox checked={conditions[0]} onChange={() => condUpdate(0)} />} label="Non-Fatigued" labelPlacement='start' />
        <FormControlLabel control={<Checkbox checked={conditions[1]}/>} onChange={() => condUpdate(1)} label="Fatigued" labelPlacement='start' />
      </FormGroup>
      <FormGroup row={true}>
        <FormControlLabel control={<Switch checked={showDevs} onChange={(ev) => setShowDevs(ev.target.checked)} />} label="Show Deviations" labelPlacement='start' />
      </FormGroup>
    </div>
    <Table size="small">
    <TableHead >
      <TableRow>
        <TableCell
            sortDirection={"id" === orderBy ? "desc" : false}
            align="left"
            sx={cellStyle}>
            <span className="icons">
              <TableSortLabel
                active={"id" === orderBy && order === "desc"}
                direction="desc"
                onClick={createSortHandler("id", "start", "desc")}
                sx={styleObj}
              >
                <Box component="span" sx={visuallyHidden}>
                  sorted descending
                </Box>
              </TableSortLabel>
              <TableSortLabel
                active={"id" === orderBy && order === "asc"}
                direction="asc"
                sx={styleObj}
                onClick={createSortHandler("id", "start", "asc")}
              >
                <Box component="span" sx={visuallyHidden}>
                  sorted descending
                </Box>
              </TableSortLabel>
            </span>
            <span>ID</span>
        </TableCell>
        {columns.map((col:Feature, idx:number) => (
          <TableCell 
            key={idx} 
            // sortDirection={col.name === orderBy ? "desc" : false}
            align="right"
            colSpan={conditions.reduce((sum, val) => sum + (val ? 1 : 0), 0)}
            sx={cellStyle}>
            
            { renderHCell(col, idx) } 
          </TableCell>
        ))}
        <TableCell>
            <button
              onClick={() => {
                const newColumns = [...columns, keyLookup("xxx")];
                console.log("New Columns:", newColumns);
                setColumns(newColumns);
                // setLoading(true); // Trigger a reload of the data with the new column
              }}
            >Add</button>
            
        </TableCell>
        <TableCell><button
              onClick={() => {
                const newColumns = [...columns];
                newColumns.pop(); // Remove the last column
                setColumns(newColumns);
                setLoading(true); // Trigger a reload of the data with the new column
                console.log("New cols", columns)
              }}
            >Remove</button>
        </TableCell>  
      </TableRow>
      <TableRow>
        <TableCell sx={cellStyle}></TableCell>
        {columns.map((col, idx) => (
          conditionNames.map((condition, condIdx) => (
            conditions[condIdx] ? (
              <TableCell key={`${idx}-${condIdx}`} align="right" sx={cellStyle}>
                <span className="icons">
                <TableSortLabel
                  active={col.key === orderBy && condition===orderByCondition && order === "desc"}
                  direction="desc"
                  onClick={createSortHandler(col.key, condition, "desc")}
                  sx={styleObj}
                >
                    <Box component="span" sx={visuallyHidden}>
                      sorted descending
                    </Box>
                  </TableSortLabel>
                  <TableSortLabel
                    active={col.key === orderBy && condition===orderByCondition && order === "asc"}
                    direction="asc"
                    sx={styleObj}
                    onClick={createSortHandler(col.key, condition, "asc")}
                  >
                    <Box component="span" sx={visuallyHidden}>
                      sorted descending
                    </Box>
                  </TableSortLabel>
                </span>
                {condition.charAt(0).toUpperCase() + condition.slice(1)} {showDevs ? "(SD)" : ""}
              </TableCell>
            ) : null
          ))
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      
      { sortedRows.map((row, rowIndex) => (
        <TableRow key={rowIndex+1}>
          <TableCell>{row.id}</TableCell>
          {row.vals.map((val, idx) => (
            <TableCell key={idx} align="right">
              {val.val.toFixed(3)} {showDevs ? `(${val.std.toFixed(2)})` : ""}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
    </>
  )
}



export default InterSubjectTable;