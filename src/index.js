#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp").sync;

const defaults = require("./defaults");

function main(dumpData, getImpl, makeResults, makeBench, options) {
  options = options || {};

  if (!dumpData && !getImpl && !makeResults && !makeBench) {
    console.log(
      'No tasks given; select from "data", "impl", "results", and "bench"'
    );
  }

  if (dumpData) {
    mkdirp(options.dataDir);

    for (let fname of ["compact-arbor.json", "compact-skeleton.json"]) {
      fs.copyFileSync(
        path.join(defaults.DATA_DIR, fname),
        path.join(options.dataDir, fname)
      );
    }
  }

  if (getImpl) {
    const fetchImpl = require("./fetchImpl");
    fetchImpl.fetchImpl(options.repo, options.branch, options.tgtPath);
  }

  if (makeResults) {
    const results = require("./results");
    results.getResults(
      options.dataDir,
      options.lambda,
      options.fraction,
      options.resultsDir
    );
  }

  if (makeBench) {
    const bench = require("./bench");
    bench.getBenchmarks(
      options.dataDir,
      options.lambda,
      options.fraction,
      options.resultsDir,
      options.reps
    );
  }
}

module.exports.main = main;

if (require.main === module) {
  main(true, true, true, true);
}
