#!/usr/bin/env node

"use strict";

//////////////////////////////
// CHANGE THESE IF YOU WANT //
//////////////////////////////

const GET_IMPL = true;
const RESULTS = true;
const BENCH = true;

//////////////////////////////

if (GET_IMPL) {
  const fetchImpl = require('./fetchImpl');
  fetchImpl.fetchImpl();
}

if (RESULTS) {
  const results = require('./results');
  results.getResults();
}

if (BENCH) {
  const bench = require('./bench');
  bench.getBenchmarks();
}
