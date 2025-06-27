import Plot from 'react-plotly.js'
import { featureNames } from '../assets/featureNames.js';

import { useState } from 'react'



function InterSubjectPlot({ results, features }: any) {

    const [xFeat, setXFeat] = useState("gct")
    const [yFeat, setYFeat] = useState("rsi")

    const plotData = {
      x: Object.values(results["mean_start"][xFeat]),
      y: Object.values(results["mean_start"][yFeat]),
      text: Object.keys(results["mean_start"]["gct"]),
      customdata: Object.values(results["mean_start"]["rsi"]),
      mode: "markers",
      type: "scatter", 
      hovertemplate : "%{text}<br>RSI: %{customdata:.2f} (s/s)"
    }

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

export default InterSubjectPlot;