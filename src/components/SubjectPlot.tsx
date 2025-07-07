import Plot from 'react-plotly.js'
import _ from 'lodash';
import { featureNames } from '../assets/featureNames.js';
import { featureLookup } from '../assets/featureLookup';
import FeatureDropdown from './FeatureDropdown.jsx';
import { jumpTree } from '../assets/trees';

import { useState, useEffect } from 'react'
import { shouldAutoRemoveFilter } from '@tanstack/react-table';



function SubjectPlot({ selectedId, features }: any) {

    const [xFeat, setXFeat] = useState(featureLookup(["performance", "rsi"]))
    const [yFeat, setYFeat] = useState(featureLookup(["performance", "gct"]))

    const [plotData, setPlotData] = useState({})
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    setLoading(true);

    fetch(`${import.meta.env.VITE_API}/api/subjects/${selectedId}/${xFeat.key}--${yFeat.key}`)
        .then((res) => res.json())
        .then((data) => {
        console.log("Jump data:", data);
        const xVals = Object.values(data[xFeat.key]);
        const yVals = Object.values(data[yFeat.key]);
        const inds = Object.values(data["idx"]);
        const lTimes = Object.values(data["start_time"]);
        const plotDataTemp = {
            x: xVals,
            y: yVals,
            text: lTimes,
            customdata: inds,
            mode: "markers",
            type: "scatter", 
            hovertemplate : "(%{x:.2f}, %{y:.2f})<br>Jump %{customdata}<br>Landed %{text:.1f} sec",
            marker: {
              colorscale: 'RdBu',
              size: 10,
              color: lTimes,
              reversescale: true,
              line: {
                width: 2,              // border thickness
                color: 'black'         // border color
              },
              colorbar: {
                title: {
                  text: "Landing Time (s)",
                  font: { size: 20 },
                  side: "right"
                },
                tickmode: "array",
                tickvals: "%{lTimes.filter((_, ind) => ind % 5 === 0)}", // Show every 5th index

              }
            }
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
          <FeatureDropdown tree={jumpTree} feature={xFeat} setter={setXFeat} />
          <span>Y Axis</span>
          <FeatureDropdown tree={jumpTree} feature={yFeat} setter={setYFeat} />
        </div>
        <Plot data={[ plotData ]}
        layout={{
          title: { text : yFeat.name + " vs " + xFeat.name }, 
          xaxis : { title: { text : xFeat.name,
                    font : { size:20 }
           },
                    showgrid: true,
                    showline: true,
                    zeroline: false,
                    mirror:true,
                    linewidth: 3 },
          yaxis : { title: { text : yFeat.name,
                              font: {size : 20} },
                    showgrid: true,
                    showline: true,
                    mirror: true,
                    linewidth: 3,
                     },
          width : 1200,
          height: 800,
        }}
      />
        </>
        )
}

export default SubjectPlot;