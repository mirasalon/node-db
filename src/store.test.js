// @flow
import React from "react";
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

test("Dummy test", () => {
  expect(1 + 1).toBe(2);
});

test("NodeDB single insertion", () => {
  const store = getStore();
  const { insert } = NodeDBCreators;
  const nodeSet = generateNodeSet();
  store.dispatch(insert(nodeSet));
  const state = store.getState();
  expect(state.NodeDB).toEqual(nodeSetToNodeMap(nodeSet));
});

// test("NodeDB multiple insertion", () => {
//   const store = getStore();
//   const { insert } = NodeDBCreators;
//   const _nodes = {
//     products: [{ id: "a", name: "p1" }, { id: "b", name: "p2" }],
//     users: [{ id: "c", name: "u1" }, { id: "d", name: "u2" }]
//   };
//   store.dispatch(insert(_nodes));
//   const state = store.getState();
//   expect(state.NodeDB.products).toEqual({
//     a: { id: "a", name: "p1" },
//     b: { id: "b", name: "p2" }
//   });
//   expect(state.NodeDB.users).toEqual({
//     c: { id: "c", name: "u1" },
//     d: { id: "d", name: "u2" }
//   });
// });

//   // =====[ Action creators ]=====
//   expect(typeof multiUpdate).toBe("function");
//   expect(multiUpdate(_nodes)).toEqual({
//     payload: _nodes,
//     type: multiUpdate.toString()
//   });

//   // =====[ Connect ]=====
//   // NOTE: this won't be necessary once off kea
//   const ConnectedComponent = ndb(SampleComponent);
//   const wrapper = mount(
//     <Provider store={store}>
//       <ConnectedComponent id={12} />
//     </Provider>
//   );

//   // =====[ Dispatch ]=====
//   store.dispatch(multiUpdate(_nodes));
//   const state = store.getState();
//   expect(state.scenes.NodeDB.products).toEqual({
//     a: { id: "a", name: "p1" },
//     b: { id: "b", name: "p2" }
//   });
//   expect(state.scenes.NodeDB.users).toEqual({
//     0: { id: 0, name: "u1" },
//     1: { id: 1, name: "u2" }
//   });
// });
