"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var R = _interopRequireWildcard(require("ramda"));

var _indices = require("./indices");

var _tests = require("./tests");

var _nodes = require("./nodes");

test("nodeTable to index", function () {
  var nodeSet = (0, _tests.generateNodeSet)();
  var nodeMap = (0, _nodes.nodeSetToNodeMap)(nodeSet);
  var indexSpec = {
    product: ["indexId1", "indexId2"],
    ugcImage: ["indexId1", "indexId2"],
    ugcStory: ["indexId1", "indexId2"]
  };
  var indexUpdates = (0, _indices.nodeMapToIndex)(nodeMap, indexSpec);
  R.keys(nodeMap).map(function (nodeType) {
    R.keys(nodeMap[nodeType]).map(function (nodeId) {
      var node = nodeMap[nodeType][nodeId];

      if (node.nodeType in indexSpec) {
        var isIndexed1 = indexUpdates[nodeType]['indexId1'][node.indexId1].includes(node.id);
        var isIndexed2 = indexUpdates[nodeType]['indexId2'][node.indexId2].includes(node.id);
        expect(isIndexed1).toEqual(true);
        expect(isIndexed2).toEqual(true);
      }

      ;
    });
  });
});