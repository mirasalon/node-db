// @flow
import React from "react";
import NodeDB from "./store";
import { resetKeaCache, keaReducer } from "kea";
import { createStore, combineReducers, compose } from "redux";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

const SampleComponent = () => null;

beforeEach(() => {
  resetKeaCache();
});

const getStore = () => {
  resetKeaCache();
  const reducers = combineReducers({
    scenes: keaReducer("scenes")
  });
  const store = createStore(reducers);
  return store;
};

test("Dummy test", () => {
  expect(1 + 1).toBe(2);
});

test("NodeDB Redux Location", () => {
  const store = getStore();
  const ndb = require("./store").default;
  expect(ndb.path).toEqual(["scenes", "NodeDB"]);
});

test("NodeDB multiUpdate", () => {
  const store = getStore();
  const ndb = require("./store").default;
  const { multiUpdate } = ndb.actions;
  const _nodes = {
    products: [{ id: "a", name: "p1" }, { id: "b", name: "p2" }],
    users: [{ id: 0, name: "u1" }, { id: 1, name: "u2" }]
  };

  // =====[ Action creators ]=====
  expect(typeof multiUpdate).toBe("function");
  expect(multiUpdate(_nodes)).toEqual({
    payload: _nodes,
    type: multiUpdate.toString()
  });

  // =====[ Connect ]=====
  const ConnectedComponent = ndb(SampleComponent);
  const wrapper = mount(
    <Provider store={store}>
      <ConnectedComponent id={12} />
    </Provider>
  );

  store.dispatch(multiUpdate(_nodes));
  const state = store.getState();
  console.log(state);
  // expect(
  //   state.scenes.NodeDB.products.toEqual({
  //     a: { id: "a", name: "p1" },
  //     b: { id: "b", name: "p2" }
  //   })
  // );
});
