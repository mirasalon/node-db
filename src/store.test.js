// @flow
import React from "react";
import * as R from "ramda";
import _ from "lodash";
import NodeDB from "./store";
import { createStore, combineReducers, compose } from "redux";
import NodeDBCreators, { nodeDBReducer, createNodeDBReducer } from "./store";
import { generateNode, generateNodeSet } from "./utils/tests";
import { nodeSetToNodeMap, sanitizeNodeType } from "./utils/nodes";
import { withNode, withoutNode } from "./index";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

const SampleComponent = () => null;

const getStore = (indexSpec = {}) => {
  const nodeDBReducer = createNodeDBReducer(indexSpec);
  const reducers = combineReducers({
    NodeDB: nodeDBReducer
  });
  const store = createStore(reducers);
  return store;
};

//#############################################################################
//# INSERTION
//#############################################################################

test("NodeDB single insertion", () => {
  const store = getStore();
  const { insert } = NodeDBCreators;

  //=====[ Insert ]=====
  const nodeSet = generateNodeSet();
  store.dispatch(insert(nodeSet));

  //=====[ Validate ]=====
  const state = store.getState();
  R.keys(nodeSet).map(nodeType => {
    nodeSet[nodeType].map(node => {
      expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(node);
    });
  });
});

test("NodeDB multiple insertion", () => {
  const store = getStore();
  const { insert } = NodeDBCreators;

  //=====[ Insert ]=====
  let nodeSets = [];
  _.range(0, 100).map(() => {
    const nodeSet = generateNodeSet();
    store.dispatch(insert(nodeSet));
    nodeSets.push(nodeSet);
  });

  //=====[ Validate ]=====
  const state = store.getState();
  nodeSets.map(nodeSet => {
    R.keys(nodeSet).map(nodeType => {
      nodeSet[nodeType].map(node => {
        expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(node);
      });
    });
  });
});

test("NodeDB insertion benchmark", () => {
  const store = getStore();
  const { insert } = NodeDBCreators;

  //=====[ Insert ]=====
  let nodeSets = [];
  _.range(0, 100).map(() => {
    const nodeSet = generateNodeSet();
    store.dispatch(insert(nodeSet));
    nodeSets.push(nodeSet);
  });
});

//#############################################################################
//# DELETION
//#############################################################################

test("simple insertion => deletion", () => {
  const store = getStore();
  const { insert, remove } = NodeDBCreators;

  //=====[ Insert ]=====
  const nodeSet = generateNodeSet();
  store.dispatch(insert(nodeSet));
  R.keys(nodeSet).map(nodeType => {
    const nodeIds = nodeSet[nodeType].map(node => node.id);
    store.dispatch(remove(nodeType, nodeIds));
  });

  //=====[ Validate ]=====
  const state = store.getState();
  R.keys(nodeSet).map(nodeType => {
    nodeSet[nodeType].map(node => {
      expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(undefined);
    });
  });
});

test("NodeDB multiple insertion => deletion", () => {
  const store = getStore();
  const { insert, remove } = NodeDBCreators;

  //=====[ Insert ]=====
  let nodeSets = [];
  _.range(0, 100).map(() => {
    const nodeSet = generateNodeSet();
    store.dispatch(insert(nodeSet));
    nodeSets.push(nodeSet);
  });
  const deleteNodeSets = nodeSets.slice(0, 20);
  const keepNodeSets = nodeSets.slice(20, 100);
  deleteNodeSets.map(nodeSet => {
    R.keys(nodeSet).map(nodeType => {
      const nodeIds = nodeSet[nodeType].map(node => node.id);
      store.dispatch(remove(nodeType, nodeIds));
    });
  });

  //=====[ Validate ]=====
  const state = store.getState();
  keepNodeSets.map(nodeSet => {
    R.keys(nodeSet).map(nodeType => {
      nodeSet[nodeType].map(node => {
        nodeType = sanitizeNodeType(nodeType);
        expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(node);
      });
    });
  });
  deleteNodeSets.map(nodeSet => {
    R.keys(nodeSet).map(nodeType => {
      nodeSet[nodeType].map(node => {
        expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(undefined);
      });
    });
  });
});

//#############################################################################
//# ENHANCERS
//#############################################################################

test("basic enhancer test", () => {
  const store = getStore();
  const { insert } = NodeDBCreators;

  //=====[ Insert ]=====
  const nodeSet = generateNodeSet();
  store.dispatch(insert(nodeSet));

  // =====[ Connect ]=====
  const node = nodeSet.product[0];
  const ConnectedComponent = withNode("product")(SampleComponent);
  const wrapper = mount(
    <Provider store={store}>
      <ConnectedComponent productId={node.id} />
    </Provider>
  );
  const props = wrapper.find(SampleComponent).props();
  expect(props.product).toEqual(node);
});

test("full enhancer test", () => {
  const store = getStore();
  const { insert } = NodeDBCreators;

  //=====[ Insert ]=====
  const nodeSet = generateNodeSet();
  store.dispatch(insert(nodeSet));

  // =====[ Connect ]=====
  R.keys(nodeSet).map(nodeType => {
    const ConnectedComponent = withNode(nodeType)(SampleComponent);
    nodeSet[nodeType].map(node => {
      const idProp = nodeType + "Id";
      const insertProps = { [idProp]: node.id };
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedComponent {...insertProps} />
        </Provider>
      );
      const props = wrapper.find(SampleComponent).props();
      expect(props[nodeType]).toEqual(node);
    });
  });
});

//#############################################################################
//# BACKWARDS COMPATIBILITY
//#############################################################################

test("node type sanitization", () => {
  expect(sanitizeNodeType("images")).toEqual("image");
  expect(sanitizeNodeType("image")).toEqual("image");
  expect(sanitizeNodeType("products")).toEqual("product");
  expect(sanitizeNodeType("product")).toEqual("product");
  expect(sanitizeNodeType("searches")).toEqual("search");
  expect(sanitizeNodeType("search")).toEqual("search");
  expect(sanitizeNodeType("story")).toEqual("story");
  expect(sanitizeNodeType("stories")).toEqual("story");
  expect(sanitizeNodeType("ugcStories")).toEqual("ugcStory");
});

test("backwards compatibility test: images, ugcImages, etc. ", () => {
  const store = getStore();
  const { insert } = NodeDBCreators;

  //=====[ Insert ]=====
  const deprecatedNodeSet = {
    images: [generateNode("image"), generateNode("image")],
    products: [generateNode("product"), generateNode("product")],
    ugcImages: [generateNode("ugcImage"), generateNode("ugcImage")],
    searches: [generateNode("search"), generateNode("search")]
  };
  store.dispatch(insert(deprecatedNodeSet));

  // =====[ Image ]=====
  let state = store.getState();
  let node = deprecatedNodeSet.images[0];
  let ConnectedComponent = withNode("image")(SampleComponent);
  let wrapper = mount(
    <Provider store={store}>
      <ConnectedComponent imageId={node.id} />
    </Provider>
  );
  let props = wrapper.find(SampleComponent).props();
  expect(props.image).toEqual(node);

  // =====[ Product ]=====
  state = store.getState();
  node = deprecatedNodeSet.products[0];
  ConnectedComponent = withNode("product")(SampleComponent);
  wrapper = mount(
    <Provider store={store}>
      <ConnectedComponent productId={node.id} />
    </Provider>
  );
  props = wrapper.find(SampleComponent).props();
  expect(props.product).toEqual(node);

  // =====[ Search ]=====
  state = store.getState();
  node = deprecatedNodeSet.searches[0];
  ConnectedComponent = withNode("search")(SampleComponent);
  wrapper = mount(
    <Provider store={store}>
      <ConnectedComponent searchId={node.id} />
    </Provider>
  );
  props = wrapper.find(SampleComponent).props();
  expect(props.search).toEqual(node);

  // =====[ ugcImage ]=====
  state = store.getState();
  node = deprecatedNodeSet.ugcImages[0];
  ConnectedComponent = withNode("ugcImage")(SampleComponent);
  wrapper = mount(
    <Provider store={store}>
      <ConnectedComponent ugcImageId={node.id} />
    </Provider>
  );
  props = wrapper.find(SampleComponent).props();
  expect(props.ugcImage).toEqual(node);
});

//#############################################################################
//# INDICES
//#############################################################################

test("NodeDB Index Specification", () => {
  const indexSpec = {
    product: ["brandId"],
    ugcImage: ["productId"]
  };
  const store = getStore(indexSpec);
  const { insert } = NodeDBCreators;
  const state = store.getState();
  expect(state.NodeDB.indexSpec).toEqual(indexSpec);
});

test("NodeDB Index Insertion", () => {
  const indexSpec = {
    product: ["indexId1", "indexId2"],
    ugcImage: ["indexId1", "indexId2"]
  };
  const store = getStore(indexSpec);
  const { insert } = NodeDBCreators;
  const nodeSet = generateNodeSet();
  const state = store.getState();
  store.dispatch(insert(nodeSet));

  expect(state.NodeDB.indexSpec).toEqual(indexSpec);
});
