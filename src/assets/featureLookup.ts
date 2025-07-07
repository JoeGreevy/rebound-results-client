import { featureNames, shortToLong, perfFeats } from "./featureNames";

import { Feature } from "./types";

export function featureLookup(cats: string[]): Feature  {
    // Takes in a string array
    // e.g. ["kinetics", "pow", "ank", "both", "pc"]
    // and returns the information needed to display the feature (name, category)
    // and to look up the values in the api or results dataframes
    
    let f = cats[cats.length - 1];
    try {
        if (cats[0] === "performance" || cats[0] === "time") {
            return {
                name: featureNames[f],
                category: cats[0],
                key: f
            }
        } else if (cats[0] === "kinetics"){
            if (cats[1] === "pow") {
                const joint = cats[2]; // might have to change
                const jointDisplay = shortToLong[joint].charAt(0).toUpperCase() + shortToLong[joint].slice(1);
                if (cats[3] === "both"){
                    return {
                        name: jointDisplay + " (L-R) " + featureNames[f],
                        category: shortToLong[cats[1]],
                        key: "pow-"+ cats[3] +"-" + joint + "-" + f
                    }
                }
            } else if (cats[1] === "mom") {
                // kinetics-mom-joint-side-feature
                const joint = cats[2]; // might have to change
                const jointDisplay = shortToLong[joint].charAt(0).toUpperCase() + shortToLong[joint].slice(1);
                let side = cats[3]
                
                
                return {
                    name: jointDisplay + " (L-R) " + featureNames[f],
                    category: shortToLong[cats[1]],
                    key: "mom-"+ cats[3] +"-" + joint + "-" + f
                }
                
            }
        }else if (cats[0] === "kin") {
            const joint = cats[1];
            const jointDisplay = shortToLong[joint].charAt(0).toUpperCase() + shortToLong[joint].slice(1);
            const side = cats[2];
            let sideDisplay = "";
            if (side === "both") {
                sideDisplay = "(L-R)";
            }else{
                sideDisplay = side.charAt(0).toUpperCase() + side.slice(1);
            }   

            return {
                name: jointDisplay + " " + sideDisplay + " " + featureNames[f],
                category: "kinematics",
                key: "kin-" + side + "-" + joint + "-" + f
            }
        }
        console.log("Bad feature lookup: ", cats);
        return {
            name: "Bad Lookup",
            category: cats.join(),
            key: "bad-lookup"
        }
    } catch (e) {
        console.log(cats)
        console.error("Error in feature lookup: ", e);
        
        return {
            name: "Bad Lookup",
            category: cats.join(),
            key: "bad-lookup"
        }
    }
}

export function keyLookup (key: string): Feature {
    // Takes in a key and returns the feature information
    // e.g. "pow-both-ank-pe" -> {name: "Peak Eccentric Power (W/kg)", category: "power", key: "pow-both-ank-pe"}
    
    const parts = key.split("-");
    if (key === "xxx"){
        return {
            name: "     ",
            category: "none",
            key: key
        }
    }
    else if (perfFeats.includes(parts[0])) {
        return {
            name: featureNames[parts[0]],
            category: "performance",
            key: key
        }
    }else if (parts[0] === "idx" || parts[0] === "start_time") {
        return {
            name: featureNames[parts[0]],
            category: "time",
            key: key
        }
    }
    const cats = parts.slice(0, -1);
    const f = parts[parts.length - 1];
    return {
        name: featureNames[f],
        category: shortToLong[cats[0]],
        key: key
    }
}

// export const featureLookup: { [key: string]: {[key:string]:string} } = {
//     "idx": {"name": "Index", "category": "time"},
//     "start_time" : {"name": "Time (s)", "category": "time"},
//     "rsi": {"name": "RSI (s/s)", "category": "performance"},
//     "rsi_adj" : {"name":"RSI (m/s)", "category": "performance"},
//     "gct": {"name":"Ground Contact Time (s)", "category": "performance"},
//     "jh": {"name": "Jump Height (m)", "category": "performance"},
//     "ft": {"name": "Flight Time (s)", "category": "performance"},

//     // Force Features
//     "avg_force": {"name": "Average Force (BW)", "category": "performance"},
//     "peak":  {"name": "Peak Force (BW)", "category": "performance"},
//     "peak_loc": {"name": "Peak Force Location", "category": "performance"},
//     "vel_change" : {"name": "Velocity Change (m/s)", "category": "performance"},
//     "avg_ecc": {"name": "Average Eccentric Force (BW)", "category": "performance"},
//     "avg_conc": {"name": "Average Concentric Force (BW)", "category": "performance"},

//     // Power Features
//     "pow-both-ank-pc" : {"name": "Peak Concentric Power (W/kg)", "category": "power"}, 
//     "pow-both-ank-pe": {"name": "Peak Eccentric Power (W/kg)", "category": "power"}, 
//     "pow-both-ank-nw": {"name": "Net Work (J/kg)", "category": "power"}, 
//     "pow-both-ank-cw": {"name": "Concentric Work (J/kg)", "category": "power"}, 
//     "pow-both-ank-ew": {"name": "Eccentric Work (J/kg)", "category": "power"}, 
//     "pow-both-ank-cp": {"name": "Concentric Proportion", "category": "power"}, 
//     "pow-both-ank-cc": {"name": "Concentric Contribution", "category": "power"}, 
//     "pow-both-ank-ec" :{"name": "Eccentric Contribution", "category": "power"},
// }; 
