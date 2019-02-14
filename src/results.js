"use strict";

const fs = require("fs");
const mkdirp = require("mkdirp");

const makeFns = require("./fns").makeFns;
const defaults = require("./defaults");

function writeResult(path, obj) {
  {
    fs.writeFileSync(path, JSON.stringify(obj, null, 2));
    console.log(`Output written to ${path}`);
  }
}

function getResults(dataDir = defaults.DATA_DIR, lambda = defaults.LAMBDA, fraction = defaults.FRACTION, resultsDir = defaults.RESULTS_DIR) {
  for (let kv of makeFns(dataDir, lambda, fraction).entries()) {
    let key = kv[0];
    let nameFns = kv[1];

    let root = resultsDir + "/" + key;
    mkdirp.sync(root);

    for (let nameFn of nameFns) {
      let path = `${root}/${nameFn[0]}.result.json`;
      let result = nameFn[1]();

      writeResult(path, result);
    }
  }
}

module.exports.getResults = getResults;
