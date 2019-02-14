const path = require("path");
const SKELETON = 3034133;

module.exports.LAMBDA = 2000;
module.exports.FRACTION = 0.9;
module.exports.BRANCH = "master";
module.exports.REPO = "catmaid/CATMAID";
module.exports.REPS = 100;
module.exports.DATA_DIR = path.join(
  path.dirname(__dirname),
  "data",
  "" + SKELETON
);
module.exports.RESULTS_DIR = path.join(process.cwd(), "results");
