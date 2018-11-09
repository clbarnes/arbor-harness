#!/usr/bin/env node

"use strict";

//////////////////////////////
// CHANGE THESE IF YOU WANT //
//////////////////////////////

const GET_IMPL = true;
const RESULTS = true;
const BENCH = true;

const TEST_SKELETON = 3034133;


const REPS = 100;

const LAMBDA = 2000;
const FRACTION = 0.9;

const BRANCH = "master";
const REPO_URL = `https://raw.githubusercontent.com/catmaid/CATMAID/${BRANCH}`;

//////////////////////////////

const fs = require('fs');
const path = require('path');
const request = require('sync-request');

function getFile(url) {
    const response = request('GET', url);
    return response.getBody('utf8');
}

function getImpl() {
  console.log(`fetching implementations from ${REPO_URL}`);

  const DATA_ROOT = path.join(__dirname, "data");

  const CATMAID_LIB_URL = REPO_URL + "/django/applications/catmaid/static/libs/catmaid";

  const ARBOR_URL = CATMAID_LIB_URL + "/Arbor.js";
  const ARBOR_PARSER_URL = CATMAID_LIB_URL + "/arbor_parser.js";
  const SYNAPSE_CLUSTERING_URL = CATMAID_LIB_URL + "/synapse_clustering.js";

  const skelRoot = path.join(DATA_ROOT, ""+TEST_SKELETON);
  const arborPath = path.join(skelRoot, 'compact-arbor.json');
  const skeletonPath = path.join(skelRoot, 'compact-skeleton.json');
  const resultsPath = path.join(skelRoot, 'results');

  const arborJs = getFile(ARBOR_URL);
  const synapseClusteringJs = getFile(SYNAPSE_CLUSTERING_URL);
  const arborParserJs = getFile(ARBOR_PARSER_URL);

  const implJs = `
  "use strict";
  
  const THREE = require('three');
  
  function extend(first, other) {{
      for (const key of Object.keys(other)) {{
          first[key] = other[key];
      }}
      return first;
  }}
  
  const $ = {};
  $.extend = extend;
  
  ${arborJs}
  
  ${synapseClusteringJs}
  
  const CATMAID = {};
  
  ${arborParserJs}
  
  exports.ArborParser = CATMAID.ArborParser;
  exports.Arbor = Arbor;
  exports.SynapseClustering = SynapseClustering;
  exports.LAMBDA = ${LAMBDA};
  exports.FRACTION = ${FRACTION};
  exports.RESULTS_PATH = '${resultsPath}';
  const fs = require('fs');
  exports.data = new Map([
      ['compact-arbor', fs.readFileSync('${arborPath}')],
      ['compact-skeleton', fs.readFileSync('${skeletonPath}')],
  ]);
  `;

  fs.writeFileSync(path.join(__dirname, "node", "impl.js"), implJs);
}

if (GET_IMPL) {
  getImpl()
}

if (RESULTS) {
  const results = require('./node/results');
  results.main()
}

if (BENCH) {
  const bench = require('./node/bench');
  bench.main(REPS)
}
