// @flow
import { type NodeId } from "../types";

export const generateId = (): NodeId =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 10) + "=";
