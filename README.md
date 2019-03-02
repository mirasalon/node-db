# NodeDB

NodeDB is a redux-based database for storing normalized objects for fast insertion/retrieval, designed to minimize re-renders and reduce prop-passing shenanigans.

## Installation

```
yarn add mirasalon/node-db
```

# Development

```
yarn
yarn jest # runs tests
yarn precompile # creates npm-installable package with latest
```

# Usage

## In Root Reducer:

```
// rootReducer.js
import { nodeDBReducer } from 'node-db';

const rootReducer = combineReducers({
    ...,
    NodeDB: nodeDBReducer // *must* be `NodeDB` for enhancers to work
});
```

## DB Queries:

```
// mySaga.js
import NodeDB from 'node-db';

// Insertions
yield put(NodeDB.insert({
  nodeType1: [ node1, node2, node3 ],
  nodeType2: [ node3, node4, node5 ]
}));

// Deletions
yield put(NodeDB.remove({
  nodeType1: [ nodeId1, nodeId2 ],
  nodeType2: [ nodeId3, nodeId4 ]
}));
```

## Accessing Nodes:

When accessing a node, use the `withNode('myNodeType')` enhancer. The HOC then accepts a prop `myNodeTypeId` that will extract the appropriate node from the NodeDB.

```
// myComponent.js
import { withNode } from 'node-db';

const UGCPostCard = ({ ugcPost }) => (
  <div>
    <div>{ugcPost.title}</div>
    <div>{ugcPost.timestamp}</div>
    <div>{ugcPost.body}</div>
  </div>
);

export default withNode('ugcPost');
```

```
// parentComponent.js
import UGCPostCard from './UGCPostCard';

const UGCPostScroller = ({ ugcPostIds }) => (
  <div>
    {ugcPostIds.map(ugcPostId => (
      <UGCPostCard ugcPostId={ugcPostId}>
    ))}
  </div>
);
```
