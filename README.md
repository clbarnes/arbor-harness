# arbor-harness

Testing tool for
[Arbor.js](https://github.com/catmaid/CATMAID/blob/master/django/applications/catmaid/static/libs/catmaid/Arbor.js)
and related tool reimplementations

Developed for node.js 11 (may work in earlier versions)

## Concept

- Fetch the existing implementation of Arbor.js, arbor_parser.js, and synapse_clustering.js
- Run all of the important functions of each with test data included in this repo, storing their output for comparison
- Benchmark each function

## Installation

```bash
# from NPM:

npm install -g arbor-harness

# Or for development:
git clone <this repo>
cd arbor-harness
npm link
```

## Usage

```bash
usage: arbor-harness [-h] [-v] [-r REPO] [-b BRANCH] [-t TGTPATH] [-d DATADIR]
              [-l LAMBDA] [-f FRACTION] [-o RESULTSDIR] [-n REPS]
              [tasks [tasks ...]]

Tool to help test alternative Arbor.py implementations

Positional arguments:
  tasks                 Any subset of "data" (copy skeleton data to
                        destination), "impl" (fetch reference implementation;
                        must be done at least once), "results" (calculate
                        results for reference implementation), and "bench"
                        (benchmark reference implementation)

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -r REPO, --repo REPO  GitHub repository from which to fetch reference
                        implementation [catmaid/CATMAID]
  -b BRANCH, --branch BRANCH
                        Git branch of the reference implementation [master]
  -t TGTPATH, --tgtPath TGTPATH
                        Additionally save the fetched implementation to a file
  -d DATADIR, --dataDir DATADIR
                        Directory containing compact-arbor.json and
                        compact-skeleton.json. If empty, will use internal
                        skeleton data
  -l LAMBDA, --lambda LAMBDA
                        lambda value to use for synapse clustering [2000]
  -f FRACTION, --fraction FRACTION
                        fraction value to use for synapse clustering [0.9]
  -o RESULTSDIR, --resultsDir RESULTSDIR
                        Directory in which to save result and benchmark
                        Outputs [./results]
  -n REPS, --reps REPS  Number of repetitions to use while benchmarking [100]
```

To run from a locally cloned version of this repo, use `npm run cli --` instead of `arbor-harness`

### Examples

```bash
# get the reference implementation (saving it internally), and also save it to ./tmp/impl.js for inspection
arbor-harness impl -t ./tmp/impl.js

# dump the included skeleton data to ./tmp/skel-data
arbor-harness data -d ./tmp/skel-data

# get results and run benchmarks for the data copied above and save them to ./tmp/output
arbor-harness results bench -d ./tmp/skel-data -o ./tmp/output
```
