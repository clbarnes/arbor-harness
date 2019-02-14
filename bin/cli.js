#!/usr/bin/env node
const argparse = require("argparse");

const defaults = require("../src/defaults");
const main = require("../src");

VERSION = "1.0.0";

const parser = new argparse.ArgumentParser({
  version: VERSION,
  addHelp: true,
  description: "Tool to help test alternative Arbor.py implementations"
});

parser.addArgument("tasks", {
  help:
    'Any subset of "data" (copy skeleton data to destination), ' +
    '"impl" (fetch reference implementation; must be done at least once), ' +
    '"results" (calculate results for reference implementation), ' +
    'and "bench" (benchmark reference implementation)',
  // choices: ["data", "impl", "results", "bench"],
  nargs: argparse.Const.ZERO_OR_MORE
});
parser.addArgument(["-r", "--repo"], {
  help: "GitHub repository from which to fetch reference implementation",
  defaultValue: defaults.REPO
});
parser.addArgument(["-b", "--branch"], {
  help: "Git branch of the reference implementation",
  defaultValue: defaults.BRANCH
});
parser.addArgument(["-t", "--tgtPath"], {
  help: "Additionally save the fetched implementation to a file"
});
parser.addArgument(["-d", "--dataDir"], {
  help:
    "Directory containing compact-arbor.json and compact-skeleton.json. " +
    "If empty, will use internal skeleton data"
});
parser.addArgument(["-l", "--lambda"], {
  help: "lambda value to use for synapse clustering",
  type: parseFloat,
  defaultValue: defaults.LAMBDA
});
parser.addArgument(["-f", "--fraction"], {
  help: "fraction value to use for synapse clustering",
  type: parseFloat,
  defaultValue: defaults.FRACTION
});
parser.addArgument(["-o", "--resultsDir"], {
  help: "Directory in which to save result and benchmark Outputs"
});
parser.addArgument(["-n", "--reps"], {
  help: "Number of repetitions to use while benchmarking",
  defaultValue: defaults.REPS
});

const parsedArgs = parser.parseArgs();

parsedArgs.tasks = parsedArgs.tasks || [];

main.main(
  parsedArgs.tasks.includes("data"),
  parsedArgs.tasks.includes("impl"),
  parsedArgs.tasks.includes("results"),
  parsedArgs.tasks.includes("bench"),
  parsedArgs
);
