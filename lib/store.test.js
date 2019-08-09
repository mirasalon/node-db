"use strict";

var _react = _interopRequireDefault(require("react"));

var R = _interopRequireWildcard(require("ramda"));

var _lodash = _interopRequireDefault(require("lodash"));

var _redux = require("redux");

var _store = _interopRequireWildcard(require("./store"));

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
  var indexSpec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var nodeDBReducer = (0, _store.createNodeDBReducer)(indexSpec);
  var reducers = (0, _redux.combineReducers)({
    NodeDB: nodeDBReducer
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
      expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(node);
    });
  });
});
test("NodeDB node dict insertion", function () {
  var store = getStore();
  var insert = _store.default.insert; //=====[ Insert ]=====

  var nodeSet = (0, _tests.generateNodeDict)();
  store.dispatch(insert(nodeSet)); //=====[ Validate ]=====

  var state = store.getState();
  R.keys(nodeSet).map(function (nodeType) {
    R.keys(nodeSet[nodeType]).map(function (nodeId) {
      var node = nodeSet[nodeType][nodeId];
      expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(node);
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
        expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(node);
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
      expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(undefined);
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
        expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(node);
      });
    });
  });
  deleteNodeSets.map(function (nodeSet) {
    R.keys(nodeSet).map(function (nodeType) {
      nodeSet[nodeType].map(function (node) {
        expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(undefined);
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
  expect((0, _nodes.sanitizeNodeType)("story")).toEqual("story");
  expect((0, _nodes.sanitizeNodeType)("stories")).toEqual("story");
  expect((0, _nodes.sanitizeNodeType)("ugcStories")).toEqual("ugcStory");
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

  var node = deprecatedNodeSet.images[0];
  var ConnectedComponent = (0, _index.withNode)("image")(SampleComponent);
  var wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, _react.default.createElement(ConnectedComponent, {
    imageId: node.id
  })));
  var props = wrapper.find(SampleComponent).props();
  expect(props.image).toEqual(node); // =====[ Product ]=====

  node = deprecatedNodeSet.products[0];
  ConnectedComponent = (0, _index.withNode)("product")(SampleComponent);
  wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, _react.default.createElement(ConnectedComponent, {
    productId: node.id
  })));
  props = wrapper.find(SampleComponent).props();
  expect(props.product).toEqual(node); // =====[ Search ]=====

  node = deprecatedNodeSet.searches[0];
  ConnectedComponent = (0, _index.withNode)("search")(SampleComponent);
  wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, _react.default.createElement(ConnectedComponent, {
    searchId: node.id
  })));
  props = wrapper.find(SampleComponent).props();
  expect(props.search).toEqual(node); // =====[ ugcImage ]=====

  node = deprecatedNodeSet.ugcImages[0];
  ConnectedComponent = (0, _index.withNode)("ugcImage")(SampleComponent);
  wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, _react.default.createElement(ConnectedComponent, {
    ugcImageId: node.id
  })));
  props = wrapper.find(SampleComponent).props();
  expect(props.ugcImage).toEqual(node);
}); //#############################################################################
//# INDICES
//#############################################################################

describe("NodeDB Indexing ", function () {
  var indexSpec = {
    product: ["indexId1", "indexId2"]
  };
  var store;
  beforeAll(function () {
    store = getStore(indexSpec);
  });
  var nodeSet;
  beforeEach(function () {
    var insert = _store.default.insert;
    nodeSet = (0, _tests.generateNodeSet)();
    store.dispatch(insert(nodeSet));
  });
  test("Store matches spec", function () {
    var state = store.getState();
    expect(state.NodeDB.indexSpec).toEqual(indexSpec);
  });
  describe("Insertion", function () {
    test("Indices should exist", function () {
      var state = store.getState();
      expect(state.NodeDB.indices).toHaveProperty("product.indexId1");
      expect(state.NodeDB.indices).toHaveProperty("product.indexId2");
    });
    test("Objects should be properly indexed", function () {
      var state = store.getState();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = nodeSet["product"][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var product = _step.value;
          expect(state.NodeDB.indices.product.indexId1[product["indexId1"]]).toContain(product["id"]);
          expect(state.NodeDB.indices.product.indexId2[product["indexId2"]]).toContain(product["id"]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
    describe("Further Insertions", function () {
      var subsequentSet;
      beforeAll(function () {
        var insert = _store.default.insert;
        subsequentSet = (0, _tests.generateNodeSet)();
        store.dispatch(insert(subsequentSet));
      });
      test("Should properly index nodes", function () {
        var state = store.getState();
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = subsequentSet["product"][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var product = _step2.value;
            expect(state.NodeDB.indices.product.indexId1[product["indexId1"]]).toContain(product["id"]);
            expect(state.NodeDB.indices.product.indexId2[product["indexId2"]]).toContain(product["id"]);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      });
      test("Should not de-index previously inserted nodes", function () {
        var state = store.getState();
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = nodeSet["product"][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var product = _step3.value;
            expect(state.NodeDB.indices.product.indexId1[product["indexId1"]]).toContain(product["id"]);
            expect(state.NodeDB.indices.product.indexId2[product["indexId2"]]).toContain(product["id"]);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      });
    });
  });
  describe("Enhancer", function () {
    test("Should pass inflated indexed nodes", function () {
      var state = store.getState();

      var sampleIndexId = _lodash.default.sample(R.keys(state.NodeDB.indices.product.indexId1));

      var ConnectedComponent = (0, _index.withIndexedNodes)("product", "indexId1")(SampleComponent);
      var wrapper = (0, _enzyme.mount)(_react.default.createElement(_reactRedux.Provider, {
        store: store
      }, _react.default.createElement(ConnectedComponent, {
        indexId: sampleIndexId
      })));
      var props = wrapper.find(SampleComponent).props();
      var expectedProducts = R.values(state.NodeDB.nodes.product).filter(function (_ref) {
        var indexId1 = _ref.indexId1;
        return indexId1 === sampleIndexId;
      });
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = expectedProducts[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var product = _step4.value;
          expect(props.indexedProductSet).toContain(product);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    });
  });
}); //#############################################################################
//# EXCEPTIONS
//#############################################################################

describe("Exceptions", function () {
  var store;
  beforeAll(function () {
    store = getStore();
  });
  test("Should add non-null nodes when collection contains null nodes", function () {
    var insert = _store.default.insert;
    var nodeSet = (0, _tests.generateSparseNodeSet)();
    store.dispatch(insert(nodeSet));
    var state = store.getState();
    Object.keys(nodeSet).map(function (nodeType) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = nodeSet[nodeType][Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var node = _step5.value;
          if (node) expect(state.NodeDB.nodes[nodeType][node.id]).toEqual(node);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    });
  });
});