"use strict";

var _react = _interopRequireDefault(require("react"));

var R = _interopRequireWildcard(require("ramda"));

var _lodash = _interopRequireDefault(require("lodash"));

var _store = _interopRequireWildcard(require("./store"));

var _redux = require("redux");

var _tests = require("./utils/tests");

var _nodes = require("./utils/nodes");

var _index = require("./index");

var _enzyme = require("enzyme");

var _reactRedux = require("react-redux");

var _enzymeAdapterReact = _interopRequireDefault(require("enzyme-adapter-react-16"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(0, _enzyme.configure)({
  adapter: new _enzymeAdapterReact.default()
});

var SampleComponent = function SampleComponent() {
  return null;
};

var getStore = function getStore() {
  var reducers = (0, _redux.combineReducers)({
    NodeDB: _store.nodeDBReducer
  });
  var store = (0, _redux.createStore)(reducers);
  return store;
}; //#############################################################################
//# INSERTION
//#############################################################################


test("NodeDB single insertion", function () {
  var store = getStore();
  var insert = _store.default.insert; //=====[ Insert ]=====

  var nodeSet = (0, _tests.generateNodeSet)();
  store.dispatch(insert(nodeSet)); //=====[ Validate ]=====

  var state = store.getState();
  R.keys(nodeSet).map(function (nodeType) {
    nodeSet[nodeType].map(function (node) {
      expect(state.NodeDB[nodeType][node.id]).toEqual(node);
    });
  });
});
test("NodeDB multiple insertion", function () {
  var store = getStore();
  var insert = _store.default.insert; //=====[ Insert ]=====

  var nodeSets = [];

  _lodash.default.range(0, 100).map(function () {
    var nodeSet = (0, _tests.generateNodeSet)();
    store.dispatch(insert(nodeSet));
    nodeSets.push(nodeSet);
  }); //=====[ Validate ]=====


  var state = store.getState();
  nodeSets.map(function (nodeSet) {
    R.keys(nodeSet).map(function (nodeType) {
      nodeSet[nodeType].map(function (node) {
        expect(state.NodeDB[nodeType][node.id]).toEqual(node);
      });
    });
  });
});
test("NodeDB insertion benchmark", function () {
  var store = getStore();
  var insert = _store.default.insert; //=====[ Insert ]=====

  var nodeSets = [];

  _lodash.default.range(0, 100).map(function () {
    var nodeSet = (0, _tests.generateNodeSet)();
    store.dispatch(insert(nodeSet));
    nodeSets.push(nodeSet);
  });
}); //#############################################################################
//# DELETION
//#############################################################################

test("simple insertion => deletion", function () {
  var store = getStore();
  var insert = _store.default.insert,
      remove = _store.default.remove; //=====[ Insert ]=====

  var nodeSet = (0, _tests.generateNodeSet)();
  store.dispatch(insert(nodeSet));
  R.keys(nodeSet).map(function (nodeType) {
    var nodeIds = nodeSet[nodeType].map(function (node) {
      return node.id;
    });
    store.dispatch(remove(nodeType, nodeIds));
  }); //=====[ Validate ]=====

  var state = store.getState();
  R.keys(nodeSet).map(function (nodeType) {
    nodeSet[nodeType].map(function (node) {
      expect(state.NodeDB[nodeType][node.id]).toEqual(undefined);
    });
  });
});
test("NodeDB multiple insertion => deletion", function () {
  var store = getStore();
  var insert = _store.default.insert,
      remove = _store.default.remove; //=====[ Insert ]=====

  var nodeSets = [];

  _lodash.default.range(0, 100).map(function () {
    var nodeSet = (0, _tests.generateNodeSet)();
    store.dispatch(insert(nodeSet));
    nodeSets.push(nodeSet);
  });

  var deleteNodeSets = nodeSets.slice(0, 20);
  var keepNodeSets = nodeSets.slice(20, 100);
  deleteNodeSets.map(function (nodeSet) {
    R.keys(nodeSet).map(function (nodeType) {
      var nodeIds = nodeSet[nodeType].map(function (node) {
        return node.id;
      });
      store.dispatch(remove(nodeType, nodeIds));
    });
  }); //=====[ Validate ]=====

  var state = store.getState();
  keepNodeSets.map(function (nodeSet) {
    R.keys(nodeSet).map(function (nodeType) {
      nodeSet[nodeType].map(function (node) {
        nodeType = (0, _nodes.sanitizeNodeType)(nodeType);
        expect(state.NodeDB[nodeType][node.id]).toEqual(node);
      });
    });
  });
  deleteNodeSets.map(function (nodeSet) {
    R.keys(nodeSet).map(function (nodeType) {
      nodeSet[nodeType].map(function (node) {
        expect(state.NodeDB[nodeType][node.id]).toEqual(undefined);
      });
    });
  });
}); //#############################################################################
//# ENHANCERS
//#############################################################################

test("basic enhancer test", function () {
  var store = getStore();
  var insert = _store.default.insert; //=====[ Insert ]=====

  var nodeSet = (0, _tests.generateNodeSet)();
  store.dispatch(insert(nodeSet)); // =====[ Connect ]=====

  var node = nodeSet.product[0];
  var ConnectedComponent = (0, _index.withNode)("product")(SampleComponent);
  var wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, _react.default.createElement(ConnectedComponent, {
    productId: node.id
  })));
  var props = wrapper.find(SampleComponent).props();
  expect(props.product).toEqual(node);
});
test("full enhancer test", function () {
  var store = getStore();
  var insert = _store.default.insert; //=====[ Insert ]=====

  var nodeSet = (0, _tests.generateNodeSet)();
  store.dispatch(insert(nodeSet)); // =====[ Connect ]=====

  R.keys(nodeSet).map(function (nodeType) {
    var ConnectedComponent = (0, _index.withNode)(nodeType)(SampleComponent);
    nodeSet[nodeType].map(function (node) {
      var idProp = nodeType + "Id";

      var insertProps = _defineProperty({}, idProp, node.id);

      var wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
        store: store
      }, _react.default.createElement(ConnectedComponent, insertProps)));
      var props = wrapper.find(SampleComponent).props();
      expect(props[nodeType]).toEqual(node);
    });
  });
}); //#############################################################################
//# BACKWARDS COMPATIBILITY
//#############################################################################

test("node type sanitization", function () {
  expect((0, _nodes.sanitizeNodeType)("images")).toEqual("image");
  expect((0, _nodes.sanitizeNodeType)("image")).toEqual("image");
  expect((0, _nodes.sanitizeNodeType)("products")).toEqual("product");
  expect((0, _nodes.sanitizeNodeType)("product")).toEqual("product");
  expect((0, _nodes.sanitizeNodeType)("searches")).toEqual("search");
  expect((0, _nodes.sanitizeNodeType)("search")).toEqual("search");
});
test("backwards compatibility test: images, ugcImages, etc. ", function () {
  var store = getStore();
  var insert = _store.default.insert; //=====[ Insert ]=====

  var deprecatedNodeSet = {
    images: [(0, _tests.generateNode)("image"), (0, _tests.generateNode)("image")],
    products: [(0, _tests.generateNode)("product"), (0, _tests.generateNode)("product")],
    ugcImages: [(0, _tests.generateNode)("ugcImage"), (0, _tests.generateNode)("ugcImage")],
    searches: [(0, _tests.generateNode)("search"), (0, _tests.generateNode)("search")]
  };
  store.dispatch(insert(deprecatedNodeSet)); // =====[ Image ]=====

  var state = store.getState();
  var node = deprecatedNodeSet.images[0];
  var ConnectedComponent = (0, _index.withNode)("image")(SampleComponent);
  var wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, _react.default.createElement(ConnectedComponent, {
    imageId: node.id
  })));
  var props = wrapper.find(SampleComponent).props();
  expect(props.image).toEqual(node); // =====[ Product ]=====

  state = store.getState();
  node = deprecatedNodeSet.products[0];
  ConnectedComponent = (0, _index.withNode)("product")(SampleComponent);
  wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, _react.default.createElement(ConnectedComponent, {
    productId: node.id
  })));
  props = wrapper.find(SampleComponent).props();
  expect(props.product).toEqual(node); // =====[ Search ]=====

  state = store.getState();
  node = deprecatedNodeSet.searches[0];
  ConnectedComponent = (0, _index.withNode)("search")(SampleComponent);
  wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, _react.default.createElement(ConnectedComponent, {
    searchId: node.id
  })));
  props = wrapper.find(SampleComponent).props();
  expect(props.search).toEqual(node); // =====[ ugcImage ]=====

  state = store.getState();
  node = deprecatedNodeSet.ugcImages[0];
  ConnectedComponent = (0, _index.withNode)("ugcImage")(SampleComponent);
  wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, _react.default.createElement(ConnectedComponent, {
    ugcImageId: node.id
  })));
  props = wrapper.find(SampleComponent).props();
  expect(props.ugcImage).toEqual(node);
});