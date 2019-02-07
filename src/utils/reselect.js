// @flow
import { createSelectorCreator, defaultMemoize } from "reselect";
import R from "ramda";
import type { NodeId, NodeArray } from "../types";

export const createDeepEqualitySelector = createSelectorCreator(
  defaultMemoize,
  R.equals
);

// Returns true if they have the same ids
const nodeListEqual = (a: NodeArray, b: NodeArray): boolean =>
  R.equals(a.map(x => x.nodeId), b.map(x => x.nodeId));

export const createNodeIdListCacheSelector = createSelectorCreator(
  defaultMemoize,
  nodeListEqual
);
