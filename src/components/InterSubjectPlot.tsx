import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';
import { featureNames } from '../assets/featureNames.js';

import { useState, useMemo, useEffect } from 'react'
import FeatureDropdown from './FeatureDropdown.jsx';
import { featureLookup } from '../assets/featureLookup';
import { interSubjectTree } from '../assets/trees';

import { Condition } from '../assets/types';

// Checkboxes
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';

import { cohorts } from '../assets/cohorts';
import { inv, row } from 'mathjs';
import { mean, set } from 'lodash';

import Divider from '@mui/material/Divider';



function InterSubjectPlot({ results, subjData }: any) {

    const [xFeat, setXFeat] = useState(featureLookup(["performance", "gct"]));
    const [yFeat, setYFeat] = useState(featureLookup(["performance", "rsi"]));
    console.log("Rendering InterSubjectPlot with features: " + xFeat.key + ", " + yFeat.key);

    // Fatigued, Non-Fatigued and 10-5 Datapoints
    const mean_dfs = ["mean_start", "mean_end", "mean_trial"];
    const conditionNames: Condition[] = ["start", "end", "trial"];
    const conditionDisplayNames: string[] = ["Non-Fatigued", "Fatigued", "10-5 Test"];
    const [conditions, setConditions] = useState<boolean[]>([true, true, false]);
    function condUpdate(idx: number) {
      const newConditions = [...conditions];
      newConditions[idx] = !newConditions[idx];
      setConditions(newConditions);
    }

    // Hover Subject
    const [hovData, setHovData] = useState(getSubjData("SN101"));

    function getSubjData(id:string, date: string = "") {
      const subj = subjData.find((s:any) => s.index === id);
      
      if (subj) {
        if (date === ""){
          date = subj.dates[subj.dates.length - 1]; // Get the last date
        }
        console.log("Found subject: ", subj);
        const dates = [date, ...subj.dates.filter((d:string) => d !== date)];
        return {
          subj: subj,
          dates: dates,
        }
      } else {
        console.error("Subject not found: ", id);
        return{
          subj: { index: id, tags: [], dates: [] },
          dates: [],
        }
      }
    }

    
    

    // Symbols should be defined by IDs
    const allTags = Object.fromEntries(
      subjData.map((m:any) => [m.index, m.tags.join("-")])
    );
    const cats = [... new Set(Object.values(allTags))];
    const markerSymbols = ["circle", "square", "diamond", "cross", "x", "triangle-up"].slice(0, cats.length);
    // Colours for plot
    const cols = ["rgba(0.6922722 , 0.0922722 , 0.16770473, 0.9)", "rgba(0.12725875, 0.39584775, 0.66874279, 0.9)", "rgba(0.101, 0.55, 0.082 0.9)"];

    // All the data from the dataframes
    const pointsData: Data[] = useMemo(() => { 
      return mean_dfs.map((name:string, idx:number)=> {
        const ids = Object.keys(results[name]) as string[];
        const rows = ids.flatMap((id:string) => {
        return Object.keys(results[name][id]).map((date: string) => {
          return [id, date];
        })
      });
      const xVals = rows.map((row: string[]) => {
        return results[name][row[0]][row[1]][xFeat.key];
      });
      const yVals = rows.map((row: string[]) => {
        return results[name][row[0]][row[1]][yFeat.key];
      });
      const rsiVals = rows.map((row: string[]) => {
        return results[name][row[0]][row[1]]["rsi"];
      });
      const symbols = rows.map((row: string[]) => {
        return markerSymbols[cats.indexOf(allTags[row[0]])]
      })
      return {
        x: xVals as number[],
        y: yVals as number[],
        text: rsiVals,
        customdata: rows,
        mode: 'markers',
        marker: {
          symbol: symbols,
          size: 10,
          color: cols[idx],
          
        },
        type: "scatter", 
        hovertemplate : "%{customdata[0]}<br>%{customdata[1]}<extra></extra>",// "%{customdata[0]}<br>%{customdata[1]}<br>RSI: %{text:.2f} (s/s)", 
        showlegend: false,
        
      }
    });
  }, [results, xFeat, yFeat, subjData]);

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
        name: conditionDisplayNames[idx],
        showlegend: true,
        hoverinfo: 'skip',
      }
    });

    const aggData: Data[] = useMemo(() => {
      console.log("Calculating aggregated data for InterSubjectPlot");
      const usedPoints =  pointsData.filter((_, i:number) => conditions[i])
      const usedEffects = effect.filter((_, i:number) => conditions[i]);
      let connectors: Data[] = [];

      for (let i = 0; i < conditions.length-1; i++) {
        for (let j = i+1; j < conditions.length; j++) {
          if (conditions[i] && conditions[j]) {
            //console.log("Adding connectors between " + mean_dfs[i] + " and " + mean_dfs[j]);
            // Connectors between df entries
            const ids_i = Object.keys(results[mean_dfs[i]]) as string[];
            const rows_i = ids_i.flatMap((id:string) => {
              return Object.keys(results[mean_dfs[i]][id]).map((date: string) => {
                return [id, date];
                })
              });
            const connectors_temp: Data[] = rows_i
              .filter((row_i: string[]) => Object.keys(results[mean_dfs[j]]).includes(row_i[0]) && Object.keys(results[mean_dfs[j]][row_i[0]]).includes(row_i[1]))
              .map((row_i: string[]) => {
              //console.log("Row i: ", row_i);
                return {
                  x: [results[mean_dfs[i]][row_i[0]][row_i[1]][xFeat.key], results[mean_dfs[j]][row_i[0]][row_i[1]][xFeat.key]],
                  y: [results[mean_dfs[i]][row_i[0]][row_i[1]][yFeat.key], results[mean_dfs[j]][row_i[0]][row_i[1]][yFeat.key]],
                  mode: 'lines',
                  type: 'scatter',
                  line: {
                    color: 'gray',
                    width: 1,
                    dash: 'dot',
                  },
                  customdata: row_i,
                  hoverinfo: 'skip',
                  showlegend: false,
                }
              })
            connectors = connectors.concat(connectors_temp);
          }

        }
      }
      return [...leg_traces, ...usedEffects, ...usedPoints, ...connectors];
    }, [pointsData, conditions]);

    const [hoverData, setHoverData] = useState<Data[]>([]);

    const handleHover = (event: any) => {
      //console.log("Hover event: ", event);
      const point = event.points[0];
      if (point && point.customdata) {
        const id = point.customdata[0];
        const date = point.customdata[1];
        let tempData: Data[] =  mean_dfs.filter((_, idx) => conditions[idx]).flatMap((name:string, idx:number)=> {
          return Object.keys(results[name]?.[id]).map((dat:string) => {
            //console.log("Hovering over: ", name, id, dat);
              return {
                x: [results[name]?.[id]?.[dat]?.[xFeat.key] ?? NaN],
                y: [results[name]?.[id]?.[dat]?.[yFeat.key] ?? NaN],
                text: [results[name]?.[id]?.[dat]?.["rsi"] ?? NaN],
                customdata: [[id, date]],
                mode: 'markers',
                marker: {
                  symbol: markerSymbols[cats.indexOf(allTags[id])],
                  size: 15,
                  color: cols[mean_dfs.indexOf(name)],
                },
                type: "scatter",
                hoverinfo: 'skip',
                //hovertemplate : "%{customdata[0]}<br>%{customdata[1]}<br>RSI: %{text:.2f} (s/s)",
                showlegend: false,
                
              };
            });
          });
        aggData.filter((d: any, idx:number) => d.mode === "lines" && d.customdata[0] === id && d.customdata[1] === date).forEach((d: any) => {
          const newD = { ...d, line: { ...d.line } };
          newD.line.dash = 'solid';
          newD.line.width = 3;
          newD.line.color = 'black';
          tempData = [newD, ...tempData];
        });
        setHoverData([...tempData])
        setHovData(getSubjData(id, date))
        // Show some sort of modal on the side
        
      }
    }
    const handleUnhover = (event: any) => {
      //console.log("Unhover event: ", event);
      setHoverData([]);
    }

    function renderTrialInfo(id: string, date: string, idx: number) {
      console.log("Rendering trial info for: ", id, date);
      console.log(results[mean_dfs[0]][id]?.[date]["rsi"]);
      return (
        <>
        <div className="subj_info_feats">
          <h4>{date}</h4>
          <h6>RSI</h6>
          {conditionNames
            .map((name, cidx) => ({name, cidx}))
            .filter(({name}) => results[`mean_${name}`]?.[id]?.[date] !== undefined)
            .map(({name, cidx}) => {
              console.log(conditionDisplayNames[cidx])
              return <p key={cidx}>   {conditionDisplayNames[cidx]}: { results[`mean_${name}`][id]?.[date]["rsi"].toFixed(2) ?? "error"}</p>
          })}
          </div>
          <Divider />
        </>
      );
    }

    //const [plotData, setPlotData] = useState<Data[]>([...aggData]);
    // useEffect(() => {
    //   setPlotData([...aggData, ...hoverData]);
    //   console.log("Effecting plot data: ", plotData)
    //   console.log("Agg Data: ", aggData.length);
    //   console.log("Hover Data: ", hoverData);
    // }, [aggData, hoverData]);


    return (
    <>
        <div className="table-controls">
          <FormGroup row={true}>
            { conditionNames.map((condition, idx) => (
              <FormControlLabel 
                key={idx} 
                control={<Checkbox checked={conditions[idx]} onChange={() => condUpdate(idx)} />} 
                label={conditionDisplayNames[idx]} 
                labelPlacement='start' 
              />
            ))}
          </FormGroup>
          {/* <FormGroup row={true}>
            <FormControlLabel control={<Switch checked={showDevs} onChange={(ev) => setShowDevs(ev.target.checked)} />} label="Show Deviations" labelPlacement='start' />
          </FormGroup> */}
        </div>
        <div className="graphNav">
          <span>X-Axis</span>
          <FeatureDropdown tree={interSubjectTree} feature={xFeat} setter={setXFeat}/>
          <span>Y Axis</span>
            <FeatureDropdown tree={interSubjectTree} feature={yFeat} setter={setYFeat}/>
        </div>
        <div className="axis">
          <Plot 
          className="inter-subject-plot"
          data={[...aggData, ...hoverData]}
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
            showlegend: true,
            legend: {
              x: 1,
              y: 1,
              xanchor: 'right',
              yanchor: 'top',
              orientation: 'h'
            },
            width : 1200,
            height: 800,
          }}
          onHover = {handleHover}
          onUnhover={handleUnhover} />
          <div className ="subj_info">
            <div className="subj_info_header">
              <h3>{hovData.subj.index}</h3>
              <p>{hovData.subj.tags.map((t:string) => t.charAt(0).toUpperCase() + t.slice(1)).join("-")}</p>
              <Divider />
            </div>
            
            {hovData?.dates.map((date:string, idx:number) => (renderTrialInfo(hovData.subj.index, date, idx)))}
            
          </div>
        </div>
        </>
        )
}

export default InterSubjectPlot;