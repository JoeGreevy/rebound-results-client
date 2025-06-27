import Plot from 'react-plotly.js'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router'

import InterSubjectPlot from './InterSubjectPlot' 
import InterSubjectTable from './InterSubjectTable'






function InterSubject(  ) {

    const [results, setResults] = useState({})
    //const [plotData, setPlotData] = useState({})
    const [loading, setLoading] = useState(true)
    const [features, setFeatures] = useState([])
    const [columns, setColumns] = useState([])
    




    // Location
    const location = useLocation();
    const end = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

    useEffect(() => {
        fetch((`https://rebound-results-api.onrender.com/api/subjects/results`)).then((res) => res.json()).then((data) => {
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
      }, []);


    if (loading) return <div>Loading...</div>;

    if (end === "graph" ){
      
      //setPlotData(plotDataTemp)
      
      return (
          <InterSubjectPlot results={results} features={features}  />
      )
    }
    
    return (
      <InterSubjectTable results={results} features={features} columns={columns} setColumns={setColumns} />
      
    )
    
    
}

export default InterSubject;