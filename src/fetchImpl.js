const request = require('sync-request');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const defaults = require('./defaults');

const SRC_PATH = path.join(__dirname, 'impl.template.js');
const TGT_PATH = path.join(__dirname, 'impl.js');

function getFile(url) {
  const response = request('GET', url);
  return response.getBody('utf8');
}

function fetchImpl(repo = defaults.REPO, branch = defaults.BRANCH, tgtPath) {
  const repoUrl = `https://raw.githubusercontent.com/${repo}/${branch}`;
  const catmaidLibUrl = repoUrl + "/django/applications/catmaid/static/libs/catmaid";

  const arborUrl = catmaidLibUrl + "/Arbor.js";
  const arborParserUrl = catmaidLibUrl + "/arbor_parser.js";
  const synapseClusteringUrl = catmaidLibUrl + "/synapse_clustering.js";

  const context = {
    arborJs: getFile(arborUrl),
    synapseClusteringJs: getFile(synapseClusteringUrl),
    arborParserJs: getFile(arborParserUrl)
  };

  const src = fs.readFileSync(SRC_PATH, "utf8");
  const template = Handlebars.compile(src, {noEscape: true});
  const result = template(context);

  fs.writeFileSync(TGT_PATH, result);
  if (!!tgtPath) {
    fs.writeFileSync(tgtPath, result);
  }
}

module.exports.fetchImpl = fetchImpl;