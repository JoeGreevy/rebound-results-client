import { useState, useEffect  } from 'react'
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createBrowserRouter,  RouterProvider, Navigate} from 'react-router-dom';

import Subject from './components/Subject.jsx'
import InterSubject from './components/InterSubject.jsx'
import Layout from './components/Layout'
import './App.css'





function App() {
  
  // Get all subject IDs from server
  const [ids, setIds] = useState([]);
  useEffect(() => {
    fetch('https://rebound-results-api.onrender.com/api/ids').then((res) => res.json())
                      .then((data) => { setIds(data.ids)  })
                      .catch(err => console.error("Error fetching ids:", err));
  }, []);

  // Selected Subject and their mass
  const [selectedId, setSelectedId] = useState('SN125');
  // const [mass, setMass] = useState(0);
  // useEffect(() => {
  //   fetch((`/api/${selectedId}/mass`)).then((res) => res.json()).then((data) => {
  //     setMass(data);
  //   }).catch(err => console.error("Error fetching mass:", err));
  // }, [selectedId]);

  // // Columns to display in the table
  

  const router = createBrowserRouter([
    {
      element: <Layout selectedId = {selectedId} />,
      children: [
        { path: '/', element: <Navigate to="/subjects/graph" /> },
        { path: '/subjects/graph', element: <InterSubject /> },
        { path: '/subjects/table', element: <InterSubject /> },
        { path: '/subjects/:selectedId/table', element: < Subject selectedId={ selectedId } setSelectedId={ setSelectedId} ids= {ids}/> },
        { path: '/subjects/:selectedId/graph', element: < Subject selectedId={ selectedId } setSelectedId={ setSelectedId} ids= {ids}/> },
      ]
    },
  ])

  return (
    <>
    {/* <Router>
      <nav>
        <Link to="/">Study</Link> |{' '}
        <Link to="/:selectedId">Tables</Link>
      </nav>
      <h5>Filter Cohorts</h5>
      <Routes>
        <Route path="/" element={<InterSubject /> } />
        <Route path="/:selectedId" element={< Subject selectedId={ selectedId } setSelectedId={ setSelectedId} ids= {ids} />} />
      </Routes>
    </Router> */}
    <RouterProvider router={router} />
    
  
     
    </> 
  )
}

// function SelectSubject({setSelectedId, ids, id}) {
  

//   return (
//     <select className="selectSubject"
//            value={id}
//             onChange={e => setSelectedId(e.target.value)}>
//         {ids.map((id) => 
//           (<option key={id} value={id}>{id}</option>)
//         )}
//     </select>
//   )
// }

// function JumpTable({ selectedId, columns, setColumns }) {
//   // Return a table of jumps for the selected subject
//   const [jumpData, setJumpData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const cols = columns.join("-")


//   useEffect(() => {
//     setLoading(true);

//     fetch(`/api/subjects/${selectedId}/${cols}`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Jump data:", data);
//         setJumpData(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Error fetching jump data:", err);
//         setLoading(false);
//       });
//   }, [selectedId, columns])

//   if (loading) return <div>Loading...</div>;
   
//   const keys = columns; 
//   const rowCount = jumpData[keys[0]].length;

//   return (
//     <>
//     <table>
//       <thead>
//         <tr>
//           {keys.map((key, idx) => (
//             <th key={idx}>
//               <select value={columns[idx]}
//                 onChange={(e) => {
//                   const newColumns = [...columns];
//                   newColumns[idx] = e.target.value;
//                   setColumns(newColumns);
//                   setLoading(true); // Trigger a reload of the data with the new columns
//                 }} >
//                   { Object.keys(featureNames).map((col, colIdx) => (
//                       <option key={colIdx} value={col}>{featureNames[col]}</option>
//                   ))}
//               </select>
//             </th>
//           ))}
//           <th>
//               <button
//                 onClick={() => {
//                   const newColumns = [...columns, "xxx"];
//                   console.log("New Columns:", newColumns);
//                   setColumns(newColumns);
//                   setLoading(true); // Trigger a reload of the data with the new column
//                 }}
//               >Add</button>
              
//           </th>
//           <th><button
//                 onClick={() => {
//                   const newColumns = [...columns];
//                   newColumns.pop(); // Remove the last column
//                   setColumns(newColumns);
//                   setLoading(true); // Trigger a reload of the data with the new column
//                 }}
//               >Remove</button></th>
          
          
          
//         </tr>
//       </thead>
//       <tbody>
//         {/*Top Summary Row */}
//         <tr key={0}>
//           {keys.map((key, idx) => (
//             <td key={idx} style={{ border: "1px solid black" }}>
//               {mean(jumpData[key])}
//             </td>
//           ))}
//         </tr>
//         {Array.from({ length: rowCount }).map((_, rowIndex) => (
//           <tr key={rowIndex+1}>
//             {keys.map((key, idx) => (
//               <td key={idx} style={{ border: "1px solid black" }}>
//                 {jumpData[key][rowIndex]}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     </>
//   )
// }




export default App;
