
import DownloadButton from './DownloadButton.jsx';
import JumpTable from './JumpTable.jsx';
import SubjectPlot from './SubjectPlot';
import { useState, useEffect } from 'react'
import { featureNames } from '../assets/featureNames.js';
import { useLocation } from 'react-router-dom';




function Subject( { selectedId, setSelectedId, ids,} ) {
  
  const [mass, setMass] = useState(0);
  useEffect(() => {
    fetch((`${import.meta.env.VITE_API}/api/${selectedId}/mass`)).then((res) => res.json()).then((data) => {
      setMass(data);
    }).catch(err => console.error("Error fetching mass:", err));
  }, [selectedId]);

  // Columns to display in the table
  const [columns, setColumns] = useState(Object.keys(featureNames).slice(0, 4))

  // Location
  const location = useLocation();
  const end = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

  if (end === "table"){
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
  }else{
    return (
      <>
      <div>
        < SelectSubject setSelectedId={setSelectedId} ids={ids} id={selectedId} />
        <span>Weight: {mass} kg ({(mass*9.81).toFixed(0)} N)</span>
      </div>
        <SubjectPlot selectedId={selectedId} features={Object.keys(featureNames)} />
      </>
    )
  }
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



export default Subject;