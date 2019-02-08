"use strict";

const fs = require("fs");
const mkdirp = require("mkdirp");

let impl;
try {
  impl = require("./impl");
} catch (e) {
  throw new Error("Implementation has not been fetched")
}
const fns = require("./fns");

function writeResult(path, obj) {
  {
    fs.writeFileSync(path, JSON.stringify(obj, null, 2));
    console.log(`Output written to ${path}`);
  }
}

function main() {
  for (let kv of fns.nameFnPairs.entries()) {
    let key = kv[0];
    let nameFns = kv[1];

    let root = impl.RESULTS_PATH + "/" + key;
    mkdirp.sync(root);

    for (let nameFn of nameFns) {
      let path = `${root}/${nameFn[0]}.result.json`;
      let result = nameFn[1]();

      writeResult(path, result);
    }
  }
}

module.exports = main;
