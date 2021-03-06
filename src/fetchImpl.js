const request = require("sync-request");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const prettier = require("prettier");

const defaults = require("./defaults");

const SRC_PATH = path.join(__dirname, "impl.js.template");
const TGT_PATH = path.join(__dirname, "impl.js");

function getFile(url) {
  const response = request("GET", url);
  return response.getBody("utf8");
}

function fetchImpl(repo = defaults.REPO, branch = defaults.BRANCH, tgtPath, prettify) {
  const repoUrl = `https://raw.githubusercontent.com/${repo}/${branch}`;
  const licenseUrl = repoUrl + "/LICENSE";
  const catmaidLibUrl =
    repoUrl + "/django/applications/catmaid/static/libs/catmaid";

  const arborUrl = catmaidLibUrl + "/Arbor.js";
  const arborParserUrl = catmaidLibUrl + "/arbor_parser.js";
  const synapseClusteringUrl = catmaidLibUrl + "/synapse_clustering.js";

  const context = {
    arborJs: getFile(arborUrl),
    synapseClusteringJs: getFile(synapseClusteringUrl),
    arborParserJs: getFile(arborParserUrl),
    license: getFile(licenseUrl)
  };

  const src = fs.readFileSync(SRC_PATH, "utf8");
  const template = Handlebars.compile(src, { noEscape: true });
  let result = template(context);
  if (!!prettify) {
    result = prettier.format(
      result,
      {
        parser: "babel",
        trailingComma: "all",
        insertPragma: true,
        endOfLine: "lf",
      }
    );
  }

  fs.writeFileSync(TGT_PATH, result);
  if (!!tgtPath) {
    fs.writeFileSync(tgtPath, result);
  }
}

module.exports.fetchImpl = fetchImpl;
