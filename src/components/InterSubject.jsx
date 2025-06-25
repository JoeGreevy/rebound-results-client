import Plot from 'react-plotly.js'
import { useState, useEffect } from 'react'
import { featureNames } from '../assets/featureNames.js';




function InterSubject(  ) {

    const [plotData, setPlotData] = useState({})
    const [loading, setLoading] = useState(true)
    const [features, setFeatures] = useState([])
    const [xFeat, setXFeat] = useState("gct")
    const [yFeat, setYFeat] = useState("rsi")

    const [x, setX] = useState([])
    const [y, setY] = useState([])

    useEffect(() => {
        fetch((`https://rebound-results-api.onrender.com/api/subjects/results`)).then((res) => res.json()).then((data) => {
          setLoading(true)
          console.log("Fetching stats")
          const feats = Object.keys(data["mean_start"])
          console.log(feats)
          setFeatures(feats)
          const plotDataTemp = {
            x: Object.values(data["mean_start"][xFeat]),
            y: Object.values(data["mean_start"][yFeat]),
            text: Object.keys(data["mean_start"]["gct"]),
            customdata: Object.values(data["mean_start"]["rsi"]),
            mode: "markers",
            type: "scatter", 
            hovertemplate : "%{text}<br>RSI: %{customdata:.2f} (s/s)"
          }
          setPlotData(plotDataTemp)
          setLoading(false)
          // console.log(data["mean_start"]["gct"]["SN101"])
        }).catch(err => console.error("Error fetching Stats:", err));
      }, [xFeat, yFeat]);


    if (loading) return <div>Loading...</div>;

    const plotData2 = {
            x: x,
            y: y,
            mode: "markers",
            type: "scatter",
          };    
    return (
        <>
        <div className="graphNav">
          <span>X-Axis</span>
          <select
            value={xFeat}
            onChange={e => setXFeat(e.target.value)}
          >
            
              { features.map((f, fIdx) => (
                  <option key={fIdx} value={f}>{featureNames[f]}</option>
              ))}
          </select>
          <span>Y Axis</span>
            <select
              value={yFeat}
              onChange={e => setYFeat(e.target.value)}
            >
        
              { features.map((f, fIdx) => (
                  <option key={fIdx} value={f}>{featureNames[f]}</option>
              ))}
          </select>
        </div>
        <Plot
        data={[
          plotData
        ]}
        layout={{
          title: { text : featureNames[yFeat] + " vs " + featureNames[xFeat] }, 
          xaxis : { title: { text : featureNames[xFeat],
                    font : { size:20 }
           },
                    showgrid: true,
                    showline: true,
                    zeroline: false,
                    mirror:true,
                    linewidth: 3 },
          yaxis : { title: { text : featureNames[yFeat],
                              font: {size : 20} },
                    showgrid: true,
                    showline: true,
                    mirror: true,
                    linewidth: 3,
                     },
          width : 800,
          height: 800,
        }}
      />
        </>
    )
}

export default InterSubject;