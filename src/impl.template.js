"use strict";

const THREE = require('three');
const $ = require("jquery");

{{aborJs}}

{{synapseClusteringJs}}

const CATMAID = {};

{{arborParserJs}}

module.exports.ArborParser = CATMAID.ArborParser;
module.exports.Arbor = Arbor;
module.exports.SynapseClustering = SynapseClustering;
