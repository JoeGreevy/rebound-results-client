import Plot from 'react-plotly.js'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router'

import InterSubjectPlot from './InterSubjectPlot' 
import InterSubjectTable from './InterSubjectTable'

import { Feature } from '../assets/types'

import { keyLookup } from '../assets/featureLookup'






function InterSubject( {ids, subjData}: any ) {

    const [results, setResults] = useState({})
    //const [plotData, setPlotData] = useState({})
    const [loading, setLoading] = useState(true)
    const [features, setFeatures] = useState<Feature[]>([])
    
    const initColNames = ["gct", "jh", "rsi", "mom-both-ank-avg_mom"]
    const [columns, setColumns] = useState<Feature[]>(initColNames.map((name) => keyLookup(name)))
    




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
          setFeatures(features)
          setLoading(false)
          // console.log(data["mean_start"]["gct"]["SN101"])
        }).catch(err => console.error("Error fetching Stats:", err));
      }, [ids]);


    if (loading) return <div>Loading...</div>;

    if (end === "graph" ){
      
      //setPlotData(plotDataTemp)
      
      return (
          <InterSubjectPlot results={results} subjData={subjData}  />
      )
    }
    
    return (
      <InterSubjectTable results={results} columns={columns} setColumns={setColumns} />
      
    )
    
    
}

export default InterSubject;