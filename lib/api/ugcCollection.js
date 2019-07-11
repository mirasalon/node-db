"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeItemFromCollection = exports.postItemToCollection = exports.getAllCollections = void 0;

var _apisauce = require("apisauce");

var _endpoints = _interopRequireDefault(require("./endpoints"));

var _utils = require("./utils");

var api = (0, _apisauce.create)({
  baseURL: _endpoints.default.ugcCollectionServer
}); // if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('Collection Server API Response: ', response)
//   );
// }
// getAllCollections: returns all ugcCollections and ugcCollectionItems for the current user

var getAllCollections = function getAllCollections() {
  return (0, _utils.authenticated)(api.get, '/all_collections');
}; // postItemToCollection: adds an item to a collection, returning updated ugcCollections


exports.getAllCollections = getAllCollections;

var postItemToCollection = function postItemToCollection(_ref) {
  var collectionItemId = _ref.collectionItemId,
      collectionId = _ref.collectionId,
      nodeId = _ref.nodeId;
  return (0, _utils.authenticated)(api.post, '/collection', {
    collectionItemId: collectionItemId,
    collectionId: collectionId,
    nodeId: nodeId
  });
};

exports.postItemToCollection = postItemToCollection;

var removeItemFromCollection = function removeItemFromCollection(_ref2) {
  var collectionItemId = _ref2.collectionItemId,
      collectionId = _ref2.collectionId,
      nodeId = _ref2.nodeId,
      type = _ref2.type;

  if (collectionId === 'pinned' || collectionId === 'tried') {
    type = collectionId;
  }

  return (0, _utils.authenticated)(api.delete, '/collection', {
    nodeId: nodeId,
    collectionItemId: collectionItemId,
    collectionId: collectionId,
    type: type
  });
};

exports.removeItemFromCollection = removeItemFromCollection;