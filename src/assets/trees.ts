const powerFeats = [
        { name: "pc", type: "item" },
        { name: "pe", type: "item" },
        { name: "nw", type: "item" },
        { name: "cw", type: "item" },
        { name: "ew", type: "item" },
        { name: "cp", type: "item" },
        { name: "cc", type: "item" },
        { name: "ec", type: "item" }
];
const momentFeats = [
    { name: "avg_mom", type: "item", joint: "all"},
    { name: "A1", type: "item", joint: "ank" },
    { name: "A1_loc", type: "item", joint: "ank" },
    { name: "K1", type: "item", joint: "kne" },
    { name: "K1_loc", type: "item", joint: "kne" },
    { name: "K2", type: "item", joint: "kne" },
    { name: "K2_loc", type: "item", joint: "kne" },
    { name: "K3", type: "item", joint: "kne" },
    { name: "K3_loc", type: "item", joint: "kne" },
    { name: "K4", type: "item", joint: "kne" },
    { name: "K4_loc", type: "item", joint: "kne" },
    { name: "H1", type: "item", joint: "hip" },
    { name: "H1_loc", type: "item", joint: "hip" },
    { name: "H2", type: "item", joint: "hip" },
    { name: "H2_loc", type: "item", joint: "hip" },

];

const kinematicFeats = [
  { name: "td", type: "item" },
  { name: "to", type: "item" },
  { name: "disp", type: "item" },
  { name: "flex", type: "item" }
]

const lrs = [
      {name: "both", type: "sub", children:powerFeats},
      {name: "left", type: "sub", children:[]},
      {name: "right", type: "sub", children:[]}
];

const kinematicTrunk = ["ank", "kne", "hip"].map((joint) => {
  return {
    name: joint,
    type: "sub",
    children: ["both", "left", "right"].map((lr) => {
        return {
            name: lr,
            type: "sub",
            children: kinematicFeats
        }
    })
  }
});

const kinematicTree = {
    name: "kin",
    type: "sub",
    children: kinematicTrunk
}
const momentsTree = ["ank", "kne", "hip"].map((joint) => {
      return {
        name: joint,
        type: "sub",
        children: ["both", "left", "right"].map((lr) => {
            return {
                name: lr,
                type: "sub",
                children: momentFeats.filter((feat) => feat.joint === "all" || feat.joint === joint)
            }
        })
      }
    });

const perfTree = {
    name: "performance",
    type: "sub",
    children: [
    { name: "gct", type: "item" },
    { name: "rsi", type: "item" },
    { name: "jh", type: "item"},
    { name: "ft", type: "item"},
    { name: "avg_force", type: "item"},
    { name: "peak", type: "item"},
    { name: "peak_loc", type: "item"},
    { name: "vel_change", type: "item"},
    { name: "avg_ecc", type: "item" },
    { name: "avg_conc", type: "item" }
    ] 
}
const timeTree = {
    name: "time",
    type: "sub",
    children: [
    { name: "idx", type: "item" },
    { name: "start_time", type: "item" }
    ]
}

const kineticsTree = {
    name: "kinetics",
    type: "sub",
    children: [
    {
        name: "mom",
        type: "sub",
        children: momentsTree
    },
    {
        name: "pow",
        type: "sub",
        children: [
        { name: "ank", type: "sub", children: lrs },
        { name: "kne", type: "sub", children: lrs },
        { name: "hip", type: "sub", children: lrs },
        ]
    }
    ]
}

export const jumpTree = [
  timeTree,
  perfTree,
  kinematicTree,
  kineticsTree
];
export const interSubjectTree = [
  perfTree,
  kinematicTree,
  kineticsTree
];