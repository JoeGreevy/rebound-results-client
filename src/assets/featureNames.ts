export const featureNames: { [key: string]: string } = {
    "idx": "Jump Index",
    "start_time" : "Landing Time (s)",
    "rsi": "RSI (s/s)",
    "rsi_adj" : "RSI (m/s)",
    "gct": "Ground Contact Time (s)",
    "jh": "Jump Height (m)",
    "ft": "Flight Time (s)",

    // Force Features
    "avg_force": "Average Force (BW)", 
    "peak":  "Peak Force (BW)",
    "peak_loc": "Peak Force Location",
    "vel_change" : "Velocity Change (m/s)", 
    "avg_ecc": "Average Eccentric Force (BW)", 
    "avg_conc": "Average Concentric Force (BW)",
    "xxx": " ",

    // Power Features
    "pc" : "Peak Concentric Power (W/kg)", 
    "pe": "Peak Eccentric Power (W/kg)", 
    "nw": "Net Work (J/kg)", 
    "cw": "Concentric Work (J/kg)", 
    "ew": "Eccentric Work (J/kg)", 
    "cp": "Concentric Proportion", 
    "cc": "Concentric Contribution", 
    "ec" :"Eccentric Contribution",

    // Moment Feature
    "avg_mom" : "Average Moments (Nm/kg)",
    "A1": "A1 (Nm/kg)",
    "A1_loc": "A1 Location",
    "K1": "K1 (Nm/kg)",
    "K1_loc": "K1 Location",
    "K2": "K2 (Nm/kg)",
    "K2_loc": "K2 Location",
    "K3": "K3 (Nm/kg)",
    "K3_loc": "K3 Location",
    "K4": "K4 (Nm/kg)",
    "K4_loc":  "K4 Location",
    "H1": "H1 (Nm/kg)",
    "H1_loc":  "H1 Location",
    "H2" : "H2 (Nm/kg)", 
    "H2_loc": "H2 Location",

    // Kinematics Features
    "td": "Touchdown Angle (deg)",
    "to": "Takeoff Angle (deg)",
    "disp": "Flexion (deg)",
    "flex": "Minimum Angle (deg)"

}; 

export const shortToLong: { [key: string]: string } = {
    "pow": "power",
    "ank": "ankle",
    "kne": "knee",
    "hip": "hip",
    "mom": "moments",
    "kinetics": "kinetics",
    "kin": "kinematics",
    "performance": "performance",
    "both": "both",
    "left": "left",
    "right": "right",
    "start_time": "landing time",
    "idx": "jump index",
    "time": "time",

    "30": "30 sec",
    "10": "10-5 test"
}

export const perfFeats = ["rsi", "rsi_adj", "gct", "jh", "ft",
    "avg_force", "peak", "peak_loc", "vel_change", "avg_ecc", "avg_conc"];