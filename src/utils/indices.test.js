import * as R from "ramda";
import { nodeTableToIndex, nodeMapToIndex } from "./indices";
import { generateNodeSet, generateNodeMap } from "./tests";
import { nodeSetToNodeMap } from "./nodes";

test("nodeTable to index", () => {
  const nodeSet = generateNodeSet();
  const nodeMap = nodeSetToNodeMap(nodeSet);
  const indexSpec = {
    product: ["indexId1", "indexId2"],
    ugcImage: ["indexId1", "indexId2"],
    ugcStory: ["indexId1", "indexId2"]
  };
  const indexUpdates = nodeMapToIndex(nodeMap, indexSpec);
  R.keys(nodeMap).map(nodeType => {
    R.keys(nodeMap[nodeType]).map(nodeId => {
      const node = nodeMap[nodeType][nodeId];
      if (node.nodeType in indexSpec) {
        const isIndexed1 = indexUpdates[nodeType]['indexId1'][node.indexId1].includes(node.id);
        const isIndexed2 = indexUpdates[nodeType]['indexId2'][node.indexId2].includes(node.id);
        expect(isIndexed1).toEqual(true);
        expect(isIndexed2).toEqual(true);
      };
    })
  })
});
