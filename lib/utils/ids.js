"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateId = void 0;

var generateId = function generateId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10) + "=";
};

exports.generateId = generateId;