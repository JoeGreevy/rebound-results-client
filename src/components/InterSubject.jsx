import Plot from 'react-plotly.js'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router'

import InterSubjectPlot from './InterSubjectPlot' 
import InterSubjectTable from './InterSubjectTable'






function InterSubject( {ids, subjData} ) {

    const [results, setResults] = useState({})
    //const [plotData, setPlotData] = useState({})
    const [loading, setLoading] = useState(true)
    const [features, setFeatures] = useState([])
    const [columns, setColumns] = useState([])
    




    // Location
    const location = useLocation();
    const end = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

    useEffect(() => {
        fetch((`${import.meta.env.VITE_API}/api/subjects/results`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(ids)
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json()
          }).then((data) => {
          setLoading(true)
          setResults(data)
          console.log("Fetching stats")
          const feats = Object.keys(data["mean_start"])
          console.log(feats)
          setFeatures(feats)
          setColumns(feats.slice(0, 4))
          setLoading(false)
          // console.log(data["mean_start"]["gct"]["SN101"])
        }).catch(err => console.error("Error fetching Stats:", err));
      }, [ids]);


    if (loading) return <div>Loading...</div>;

    if (end === "graph" ){
      
      //setPlotData(plotDataTemp)
      
      return (
          <InterSubjectPlot results={results} features={features} subjData={subjData}  />
      )
    }
    
    return (
      <InterSubjectTable results={results} features={features} columns={columns} setColumns={setColumns} />
      
    )
    
    
}

export default InterSubject;