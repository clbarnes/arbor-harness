"use strict";

const fs = require("fs");
const perfy = require("perfy");
const mkdirp = require("mkdirp");

const defaults = require("./defaults");
const makeFns = require("./fns").makeFns;

function writeBench(path, obj) {
  {
    fs.writeFileSync(path, JSON.stringify(obj, null, 2));
    console.log(`Benchmark written to ${path}`);
  }
}

function mean(arr) {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function std(arr) {
  const avg = mean(arr);
  const sqDiffs = arr.map(val => {
    let diff = val - avg;
    return diff * diff;
  });

  return Math.sqrt(mean(sqDiffs));
}

function bench(fn, reps) {
  const runtimes = Array(reps)
    .fill(NaN)
    .map(() => {
      perfy.start("this");
      fn();
      let result = perfy.end("this");
      return result.fullNanoseconds;
    });

  return {
    runtimes: runtimes,
    mean: mean(runtimes),
    std: std(runtimes)
  };
}

function getBenchmarks(
  dataRoot = defaults.DATA_DIR,
  lambda = defaults.LAMBDA,
  fraction = defaults.FRACTION,
  tgtDir = defaults.RESULTS_DIR,
  reps = defaults.REPS
) {
  for (let kv of makeFns(dataRoot, lambda, fraction).entries()) {
    let key = kv[0];
    let nameFns = kv[1];

    let root = tgtDir + "/" + key;
    mkdirp.sync(root);

    for (let nameFn of nameFns) {
      console.log(`Benchmarking ${nameFn[0]}...`);
      let path = `${root}/${nameFn[0]}.bench.json`;
      let result = bench(nameFn[1], reps);

      writeBench(path, result);
    }
  }
}

module.exports.getBenchmarks = getBenchmarks;
