"use strict";

const deepcopy = require("deepcopy");

let impl;
try {
  impl = require("./impl");
} catch (e) {
  throw new Error("Implementation has not been fetched")
}

// ARBORPARSER

function fromCompactSkeleton() {
  const ap = new impl.ArborParser();
  return ap.init(
    "compact-skeleton",
    JSON.parse(impl.data.get("compact-skeleton"))
  );
}

function fromCompactArbor() {
  const ap = new impl.ArborParser();
  return ap.init("compact-arbor", JSON.parse(impl.data.get("compact-arbor")));
}

const arborParser = fromCompactArbor();

function createSynapseMap() {
  return arborParser.createSynapseMap();
}

const synapseMap = createSynapseMap();

// ARBOR

const arbor = arborParser.arbor;

const locations = arborParser.positions;

const distanceFn = function(child, paren) {
  {
    return this[child].distanceTo(this[paren]);
  }
}.bind(locations);

function nodesDistanceTo() {
  return arbor.nodesDistanceTo(arbor.root, distanceFn);
}

function allSuccessors() {
  return arbor.allSuccessors();
}

function childrenArray() {
  return arbor.childrenArray();
}

function findBranchAndEndNodes() {
  return arbor.findBranchAndEndNodes();
}

const outputs = deepcopy(arborParser.outputs);
const inputs = deepcopy(arborParser.inputs);
const n_outputs = deepcopy(arborParser.n_outputs);
const n_inputs = deepcopy(arborParser.n_inputs);

function flowCentrality() {
  return arbor.flowCentrality(outputs, inputs, n_outputs, n_inputs);
}

function nodesOrderFrom() {
  return arbor.nodesOrderFrom(arbor.root);
}

function partition() {
  return arbor.partition();
}

function partitionSorted() {
  return arbor.partitionSorted();
}

// SYNAPSE CLUSTERING

function synapseClustering() {
  return new impl.SynapseClustering(arbor, locations, synapseMap, impl.LAMBDA);
}

const realSynapseClustering = synapseClustering();

function distanceMap() {
  return realSynapseClustering.distanceMap();
}

function densityHillMap() {
  return realSynapseClustering.densityHillMap();
}

const dhm = densityHillMap();

function clusters() {
  return realSynapseClustering.clusters(dhm);
}

function clusterMaps() {
  return realSynapseClustering.clusterMaps(dhm);
}

function clusterSizes() {
  return realSynapseClustering.clusterSizes(dhm);
}

const clus = clusters();

function segregationIndex() {
  return realSynapseClustering.segregationIndex(clus, outputs, inputs);
}

const fcs = flowCentrality();

function arborRegions() {
  return realSynapseClustering.findArborRegions(arbor, fcs, impl.FRACTION);
}

function findAxon() {
  return realSynapseClustering.findAxon(arborParser, impl.FRACTION, locations);
}

const regions = arborRegions();

const outputSet = Object.entries(outputs).reduce((accum, kv) => {
  let node = kv[0];
  let n = kv[1];

  if (n > 0) {
    accum[node] = undefined;
  }

  return accum;
}, {});

const above = deepcopy(regions.above);

function findAxonCut() {
  return realSynapseClustering.findAxonCut(arbor, outputSet, above, locations);
}

exports.nameFnPairs = new Map([
  [
    "arbor_parser",
    [
      ["from_compact-skeleton", fromCompactSkeleton],
      ["from_compact-arbor", fromCompactArbor],
      ["create_synapse_map", createSynapseMap]
    ]
  ],
  [
    "arbor",
    [
      ["nodes_distance_to", nodesDistanceTo],
      ["all_successors", allSuccessors],
      ["children_array", childrenArray],
      ["find_branch_and_end_nodes", findBranchAndEndNodes],
      ["flow_centrality", flowCentrality],
      ["nodes_order_from", nodesOrderFrom],
      ["partition", partition],
      ["partition_sorted", partitionSorted],
      ["partition_sorted", partitionSorted]
    ]
  ],
  [
    "synapse_clustering",
    [
      ["synapse_clustering", synapseClustering],
      ["distance_map", distanceMap],
      ["density_hill_map", densityHillMap],
      ["clusters", clusters],
      ["cluster_maps", clusterMaps],
      ["cluster_sizes", clusterSizes],
      ["segregation_index", segregationIndex],
      ["arbor_regions", arborRegions],
      ["find_axon", findAxon],
      ["find_axon_cut", findAxonCut]
    ]
  ]
]);
