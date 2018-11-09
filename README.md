# arbor-harness

Testing tool for 
[Arbor.js](https://github.com/catmaid/CATMAID/blob/master/django/applications/catmaid/static/libs/catmaid/Arbor.js)
and related tool reimplementations

Developed for node.js 11 (may work in earlier versions)

## Concept

- Fetch the existing implementation of Arbor.js, arbor_parser.js, and synapse_clustering.js
- Run all of the important functions of each with test data included in this repo, storing their output for comparison
- Benchmark each function

## Output

In `./data/<test skeleton>/results/` will be directories containing:

- `*.results.json` (JSON-serialised results of each function call)
- `*.bench.json` (benchmark results, keys are self-explanatory)

## Installation

```bash
git clone <this repo>
cd arbor-harness
npm install
```

## Usage

```bash
npm start
```

If you want to change the behaviour of the script 
(e.g. pull from a different branch, deactivate implementation fetching, results or benchmarks)
edit the constants at the start of `./index.js`.
