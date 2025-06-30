import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';
import { featureNames } from '../assets/featureNames.js';

import { useState } from 'react'

import { cohorts } from '../assets/cohorts';
import { inv } from 'mathjs';



function InterSubjectPlot({ results, features, subjData }: any) {

    const [xFeat, setXFeat] = useState("gct")
    const [yFeat, setYFeat] = useState("rsi")

    const ids = Object.keys(results["mean_start"]["gct"]) as string[];
    const allTags = subjData.map((m:any) => m.tags.join("-"));
    const cats = [... new Set(allTags)];
    // const allTagsFlat = allTags.flat();
    // const markerCats = allTagsFlat.filter((tag:string) => !cohorts["values"].includes(tag));

    const markerSymbols = ["circle", "square", "diamond", "cross"].slice(0, cats.length);
    const symbols = allTags.map((tag:string) => {
      return markerSymbols[cats.indexOf(tag)];
    });

    const mean_dfs = ["mean_start", "mean_end"];
    const cols = ["rgba(0.6922722 , 0.0922722 , 0.16770473, 0.9)", "rgba(0.12725875, 0.39584775, 0.66874279, 0.9)"  ]
    const plotData: Data[] = mean_dfs.map((name:string, idx:number)=> {
        return {
        x: Object.values(results[name][xFeat]) as number[],
        y: Object.values(results[name][yFeat]) as number[],
        text: ids,
        customdata: Object.values(results[name]["rsi"]) as number[],
        mode: 'markers',
        marker: {
          symbol: symbols,
          size: 10,
          color: cols[idx],
        },
        type: "scatter", 
        hovertemplate : "%{text}<br>RSI: %{customdata:.2f} (s/s)", 
        showlegend: false,
      }
    });

    

    const connectors: Data[] = ids.map((id: string) => {
      return {
        x: [results["mean_start"][xFeat][id], results["mean_end"][xFeat][id]],
        y: [results["mean_start"][yFeat][id], results["mean_end"][yFeat][id]],
        mode: 'lines',
        type: 'scatter',
        line: {
          color: 'gray',
          width: 1,
          dash: 'dot',
        },
        hoverinfo: 'skip',
        showlegend: false,
      }
    })

    // Invisible traces for legend
    const leg_traces: Data[] = markerSymbols.map((symbol, idx) => {
      return {
        x: [null],
        y: [null],
        mode: 'markers',
        type: 'scatter',
        marker: {
          symbol: symbol,
          size: 12,
          color: 'gray',
        },
        name: cats[idx] as string,
        showlegend: true,
        hoverinfo: 'skip',
      }
    })

    const conditions = ["Non-fatigued", "Fatigued"];
    const effect: Data[] = cols.map((col, idx) => {
      return {
        x: [null],
        y: [null],
        mode: 'markers',
        type: 'bar',
        marker: {
          // symbol: "circle",
          // size: 12,
          color: col,
        },
        name: conditions[idx],
        showlegend: true,
        hoverinfo: 'skip',
      }
    });

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
        <Plot data={[ plotData, leg_traces, connectors, effect ].flat()}
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
          showlegend: true,
          width : 1200,
          height: 800,
        }}
      />
        </>
        )
}

export default InterSubjectPlot;