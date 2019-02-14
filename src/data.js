const fs = require('fs');
const path = require('path');

class Data {
  constructor(dataPath, lazy) {
    this.dataPath = dataPath;
    this._compactArborStr = null;
    this._compactSkeletonStr = null;
    if (!lazy) {
      this.compactArbor();
      this.compactSkeleton();
    }
  }

  get compactArbor() {
    if (!this._compactArborStr) {
      this._compactArborStr = fs.readFileSync(path.join(this.dataPath, "compact-arbor.json"));
    }
    return JSON.parse(this._compactArborStr);
  }

  get compactSkeleton() {
    if (!this._compactSkeletonStr) {
      this._compactSkeletonStr = fs.readFileSync(path.join(this.dataPath, "compact-arbor.json"));
    }
    return JSON.parse(this._compactSkeletonStr);
  }
}

module.exports.Data = Data;
