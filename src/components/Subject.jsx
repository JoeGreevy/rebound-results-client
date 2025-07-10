
import DownloadButton from './DownloadButton.jsx';
import JumpTable from './JumpTable.jsx';
import SubjectPlot from './SubjectPlot';
import { useState, useEffect } from 'react'
import { shortToLong, featureNames } from '../assets/featureNames.js';
import { useLocation } from 'react-router-dom';

import FeatureDropdown from './FeatureDropdown.jsx';
import { set } from 'lodash';
//import { Feature } from '../assets/types';

import { keyLookup } from '../assets/featureLookup.js';




function Subject( { selectedId, setSelectedId, ids,} ) {
  const [loading, setLoading] = useState(true);
  const [mass, setMass] = useState(0);
  const [date, setDate] = useState(0);
  const [pro, setPro] = useState("30");
  const [subjData, setSubjData] = useState({});
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/${selectedId}`)
          .then((res) => res.json())
          .then((data) => {
          console.log("Jump data:", data);
          const dates = Object.keys(data);
          const latestDate = dates[dates.length - 1];
          const pros = Object.keys(data[latestDate]);
          const currentPro = pros.includes(pro) ? pro : pros[0];

          setDate(dates[dates.length - 1]); 
          // setMass(data[latestDate][currentPro].mass);
          setPro(currentPro);
          setSubjData(data)
          setLoading(false);
        }).catch(err => console.error("Error fetching subject:", err));
      }, [selectedId]);

  useEffect(() => {
    if (subjData[date] && subjData[date][pro]) {
      setMass(subjData[date][pro].mass);
    }
  }, [date]);

  // Columns to display in the table
  const initColNames = ["gct", "jh", "rsi", "mom-both-ank-avg_mom"]
  const [columns, setColumns] = useState(initColNames.map((name) => keyLookup(name)))

  // Location
  const location = useLocation();
  const end = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  




  // ID Tree for feature dropdown
  const idTree = ids.map((id) => ({name: id, key: id, type: "subj"}));
  const dateTree = Object.keys(subjData).map((date) => ({key: date, name: date, type: "date"}));
  const proTree = Object.keys(subjData[date]).map((pro) => ({key: pro, name: shortToLong[pro], type: "pro"}));

  if (end === "table"){
    return (
      <>
      <div className="feature-dropdown">
        {/* < SelectSubject setSelectedId={setSelectedId} ids={ids} id={selectedId} /> */}
        <FeatureDropdown  tree={idTree} feature={{name: selectedId}} setter={setSelectedId} />
        <FeatureDropdown  tree={dateTree} feature={{name: date}} setter={setDate} />
        <FeatureDropdown  tree={proTree} feature={{name: shortToLong[pro]}} setter={setPro} />
        <span>Weight: {mass.toFixed(0)} kg ({ (mass*9.81).toFixed(0) } N)</span>
        < DownloadButton selectedId={selectedId} features={columns} mass={mass} />
      </div>
        
        
        {/* Choose Columns */}

        {/* Results Table: Pass the selectedID and the columns to search for */}
        < JumpTable data={subjData} id={selectedId} date={date} pro={pro} columns={columns} setColumns={setColumns} />
      </>
    )
  }else{
    return (
      <>
      <div className="feature-dropdown">
        {/* < SelectSubject setSelectedId={setSelectedId} ids={ids} id={selectedId} /> */}
        <FeatureDropdown  tree={idTree} feature={{name: selectedId}} setter={setSelectedId} />
        <FeatureDropdown  tree={dateTree} feature={{name: date}} setter={setDate} />
        <FeatureDropdown  tree={proTree} feature={{name: shortToLong[pro]}} setter={setPro} />
        <span>Weight: {mass.toFixed(0)} kg ({(mass*9.81).toFixed(0)} N)</span>
      </div>
        <SubjectPlot data={subjData} id={selectedId} date={date} pro={pro} ids={ids} />
      </>
    )
  }
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



export default Subject;