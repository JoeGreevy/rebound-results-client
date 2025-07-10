import Plot from 'react-plotly.js'
import _ from 'lodash';
import { featureNames } from '../assets/featureNames.js';
import { featureLookup } from '../assets/featureLookup';
import FeatureDropdown from './FeatureDropdown.jsx';
import { jumpTree } from '../assets/trees';

import { FormGroup, FormControlLabel, Switch } from '@mui/material';

import { useState, useEffect, useMemo } from 'react'
import { shouldAutoRemoveFilter } from '@tanstack/react-table';

import {Feature} from '../assets/types';

type SubjectPlotProps = {
  data: any;
  id: string; 
  date: string;
  pro : string;
  ids: string[];
};

type CrossLine = {
  mean: number;
  err: number;
}


function SubjectPlot({ data, id, date, pro, ids }: SubjectPlotProps) {
    const [xFeat, setXFeat] = useState(featureLookup(["time", "idx"]))
    const [yFeat, setYFeat] = useState(featureLookup(["performance", "rsi"]))

    const [plotData, setPlotData] = useState({})
    const [loading, setLoading] = useState(true);

    const [apiCrossData, setApiCrossData] = useState<{[key: string]: CrossLine}>({});

    useEffect(() => {
      setLoading(true);

      console.log("Effecting SubjectPlot: ", id, date, pro);
      const xVals = Object.values(data[date][pro][xFeat.key]);
      const yVals = Object.values(data[date][pro][yFeat.key]);
      const inds = Object.values(data[date][pro]["idx"]);
      const lTimes = Object.values(data[date][pro]["start_time"]);
      const plotDataTemp = {
        x: xVals,
        y: yVals,
        text: lTimes,
        customdata: inds,
        mode: "markers",
        type: "scatter", 
        hovertemplate : "(%{x:.2f}, %{y:.2f})<br>Jump %{customdata}<br>Landed %{text:.1f} sec",
        marker: {},
        showlegend: false,
      }

        if (pro === "30"){
          plotDataTemp.marker = {
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
        }else{
          
          const indices = Array.from({ length: 10 }, (_, i) => i);
          console.log("inds: ", indices);
          const t_inds = (data[date][pro]["trial_indices"] as number[]);
          const symbols: string[] = [];
          const sizes: number[] = [];

          console.log("t_inds: ", t_inds);
          for (const ind of (indices as number[])){
            symbols.push(t_inds.includes(ind) ? "square" : "circle");
            sizes.push(t_inds.includes(ind) ? 15 : 10);
          }
          plotDataTemp.marker = {
            symbol: symbols,
            size: sizes,
            line: {
              width: 2,              // border thickness
              color: 'rgba(0.101, 0.55, 0.082 0.9)'         // border color
            }
          }
        }
        setPlotData(plotDataTemp);
        setLoading(false);
    }, [id, date, pro, xFeat, yFeat, data]);

    // Get mean and std of xFeat and yFeat in features
    useEffect(() => {
      const feats = [xFeat, yFeat];
      const apiFeats = feats.filter(feat => feat.category !== "time");
      
      apiFeats.forEach(feat => {
        console.log("Fetching: ", `${import.meta.env.VITE_API}/api/subjects/results/${feat.key}`)
        fetch((`${import.meta.env.VITE_API}/api/subjects/results/${feat.key}`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ids: ids})
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json()
        }).then((apiData) => {
          setApiCrossData(prev => ({
            ...prev,
            [feat.key]: feat.category === "kinematics" 
              ? {mean: apiData.mean, err: apiData.std} // Convert to degrees
              : {mean: apiData.mean, err: apiData.std}
          }));
        }).catch(err => console.error("Error fetching Stats:", err));
      });
    }, [xFeat, yFeat, ids]);

    // Compute crossData from local data and API data
    const crossData = useMemo(() => {
      const feats = [xFeat, yFeat];
      return feats.map(feat => {
        if (feat.category === "time") {
          // Calculate from local data
          const vals = Object.values(data[date][pro][feat.key]) as number[];
          const mean = _.mean(vals);
          const err = (_.max(vals)! - _.min(vals)!)/10;
          return {mean, err};
        } else {
          // Use API data if available
          return apiCrossData[feat.key] || {mean: 0, err: 0};
        }
      });
    }, [xFeat, yFeat, data, date, pro, apiCrossData]);

    const cross = useMemo(() => {
      //console.log("Cross Data: ", crossData);
        return ( [
          {
            x: [crossData[0].mean, crossData[0].mean],
            y: [crossData[1].mean + crossData[1].err, crossData[1].mean - crossData[1].err],
            type: 'scatter',
            mode: 'lines', 
            line: {
              width: 2,
              color: 'rgba(0.101, 0.55, 0.082 0.9)' // Green color
            },
            showlegend: false,
          },
          {
            x: [crossData[0].mean + crossData[0].err , crossData[0].mean - crossData[0].err],
            y: [crossData[1].mean, crossData[1].mean],
            type: 'scatter',
            mode: 'lines', 
            line: {
              width: 2,
              color: 'rgba(0.101, 0.55, 0.082 0.9)' // Green color
            },
            showlegend: false,
          }
        ]);
    }, [crossData]);

    const [showCross, setShowCross] = useState(true);

    const plots = showCross ? [ plotData, ...cross ] : [plotData];

    if (loading) return <div>Loading...</div>;



    return (
    <>
        <div className="graphNav">
          <span>X-Axis</span>
          <FeatureDropdown tree={jumpTree} feature={xFeat} setter={setXFeat} />
          <span>Y Axis</span>
          <FeatureDropdown tree={jumpTree} feature={yFeat} setter={setYFeat} />
        </div>
        <div className="axis-controls">
            
            <FormGroup row={true}>
              <FormControlLabel control={<Switch checked={showCross} onChange={(ev) => setShowCross(ev.target.checked)} />} label="Show Average and Standard Deviation across study" labelPlacement='start' />
            </FormGroup>
          </div>
        <Plot data={plots}
        layout={{
          title: { text : yFeat.name + " vs " + xFeat.name }, 
          xaxis : { title: { text : xFeat.name,
                    font : { size:20 }
           },
                    showgrid: true,
                    showline: true,
                    zeroline: false,
                    mirror:true,
                    linewidth: 3,
                    tickfont: {
                      size: 16,
                      family: 'Arial, sans-serif'
                    }
                  },
          yaxis : { title: { text : yFeat.name,
                              font: {size : 20} },
                    showgrid: true,
                    showline: true,
                    mirror: true,
                    linewidth: 3,
                    tickfont: {
                      size: 16,
                      family: 'Arial, sans-serif'
                    }
                     },
          width : 1200,
          height: 800,
        }}
      />
        </>
        )
}

export default SubjectPlot;