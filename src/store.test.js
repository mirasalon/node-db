// @flow
import React from "react";
import R from "ramda";
import _ from "lodash";
import NodeDB from "./store";
import { createStore, combineReducers, compose } from "redux";
import NodeDBCreators, { nodeDBReducer } from "./store";
import { generateNode, generateNodeSet, nodeSetToNodeMap } from "./utils";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

const SampleComponent = () => null;

const getStore = () => {
  const reducers = combineReducers({
    NodeDB: nodeDBReducer
  });
  const store = createStore(reducers);
  return store;
};

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
      expect(state.NodeDB[nodeType][node.id]).toEqual(node);
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
        expect(state.NodeDB[nodeType][node.id]).toEqual(node);
      });
    });
  });
});
