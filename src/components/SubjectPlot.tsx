import Plot from 'react-plotly.js'
import _ from 'lodash';
import { featureNames } from '../assets/featureNames.js';

import { useState, useEffect } from 'react'



function SubjectPlot({ selectedId, features }: any) {

    const [xFeat, setXFeat] = useState("start_time")
    const [yFeat, setYFeat] = useState("rsi")

    const [plotData, setPlotData] = useState({})
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    setLoading(true);

    fetch(`https://rebound-results-api.onrender.com/api/subjects/${selectedId}/${xFeat}-${yFeat}`)
        .then((res) => res.json())
        .then((data) => {
        console.log("Jump data:", data);
        const xVals = Object.values(data[xFeat]);
        const plotDataTemp = {
            x: xVals,
            y: Object.values(data[yFeat]),
            text: _.range(0, xVals.length),
            //customdata: Object.values(results["mean_start"]["rsi"]),
            mode: "markers",
            type: "scatter", 
            hovertemplate : "%{text}"
        }
        setPlotData(plotDataTemp);
        setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching jump data:", err);
            setLoading(false);
        });
    }, [selectedId, xFeat, yFeat]);
    
    if (loading) return <div>Loading...</div>;

    

    return (
    <>
        <div className="graphNav">
          <span>X-Axis</span>
          <select
            value={xFeat}
            onChange={e => setXFeat(e.target.value)}
          >
            
              { features.map((f:string, fIdx:number) => (
                  <option key={fIdx} value={f}>{featureNames[f]}</option>
              ))}
          </select>
          <span>Y Axis</span>
            <select
              value={yFeat}
              onChange={e => setYFeat(e.target.value)}
            >
        
              { features.map((f:string, fIdx:number) => (
                  <option key={fIdx} value={f}>{featureNames[f]}</option>
              ))}
          </select>
        </div>
        <Plot data={[ plotData ]}
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

export default SubjectPlot;