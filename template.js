const fs = require('fs');

{arbor_js}


{synapse_clustering_js}


const CATMAID = {{}};


{arbor_parser_js}


const ArborParser = CATMAID.ArborParser;


class Vector3 {{
    constructor(x, y, z) {{
        this.x = x;
        this.y = y;
        this.z = z;
    }}

    distanceTo(other) {{
        let out = 0;
        for (const key of "xyz") {{
            out += Math.pow(this[key] - other[key], 2);
        }}
        return Math.sqrt(out);
    }}
}}

// ------- SHIMS FOR EXTERNAL LIBRARIES --------

const THREE = {{}};
THREE.Vector3 = Vector3;

function extend(first, other) {{
    for (const key of Object.keys(other)) {{
        first[key] = other[key];
    }}
    return first;
}}

const $ = {{}};
$.extend = extend;

const LAMBDA = {LAMBDA};
const FRACTION = {FRACTION};
const RESULTS_PATH = '{results_path}';
const REPS = {REPS};

const data = new Map([
    ['compact-arbor', fs.readFileSync('{arbor_path}')],
    ['compact-skeleton', fs.readFileSync('{skeleton_path}')],
]);


exports.ArborParser = ArborParser;
exports.Arbor = Arbor;
exports.SynapseClustering = SynapseClustering;
exports.LAMBDA = LAMBDA;
exports.FRACTION = FRACTION;
exports.RESULTS_PATH = RESULTS_PATH;
exports.REPS = REPS;
exports.data = data;

// module.exports = {
//     "ArborParser": ArborParser,
//     "Arbor": Arbor,
//     "SynapseClustering": SynapseClustering,
//     "LAMBDA": LAMBDA,
//     "FRACTION": FRACTION,
//     "RESULTS_PATH": RESULTS_PATH,
// };
