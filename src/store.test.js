// @flow
import NodeDB from "./store";
import { resetKeaCache, keaReducer } from "kea";
import { createStore, combineReducers, compose } from "redux";

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

test("NodeDB multiUpdate insertion", () => {
  const store = getStore();
  const ndb = require("./store").default;
  const { multiUpdate } = ndb.actions;
  const _nodes = {
    products: [{ id: "a", name: "p1" }, { id: "b", name: "p2" }],
    users: [{ id: 0, name: "u1" }, { id: 1, name: "u2" }]
  };
  expect(typeof multiUpdate).toBe("function");
  expect(multiUpdate(_nodes)).toEqual({
    payload: _nodes,
    type: multiUpdate.toString()
  });
});
