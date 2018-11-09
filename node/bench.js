"use strict";

const fs = require("fs");
const perfy = require("perfy");
const mkdirp = require("mkdirp");

const impl = require("./impl");
const fns = require("./fns");

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

function main(reps = 100) {
  for (let kv of fns.nameFnPairs.entries()) {
    let key = kv[0];
    let nameFns = kv[1];

    let root = impl.RESULTS_PATH + "/" + key;
    mkdirp.sync(root);

    for (let nameFn of nameFns) {
      console.log(`Benchmarking ${nameFn[0]}...`);
      let path = `${root}/${nameFn[0]}.bench.json`;
      let result = bench(nameFn[1], reps);

      writeBench(path, result);
    }
  }
}

exports.main = main;
