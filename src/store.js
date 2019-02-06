// @flow
import { kea } from "kea";
import R from "ramda";
import PropTypes from "prop-types";
import Immutable from "seamless-immutable";
import { type NodeId } from "./types";

const updateEntry = (
  table: Immutable.object,
  id: string,
  update: Object
): Immutable.object => table.merge({ [id]: update }, { deep: true });

const removeEntries = (
  table: Immutable.object,
  ids: Array<NodeId>
): Immutable.object => {
  return Immutable.without(table, ids);
};

const updateTable = (
  table: Immutable.object,
  updates: Array<Object> = [],
  idProp: string = "id",
  indexedBy: string | null = null
): Immutable.object => {
  const filteredUpdates = updates.filter(x => x);

  const updateObject = Immutable.asObject(filteredUpdates, x => [x[idProp], x]);

  if (indexedBy) {
    const indexUpdates = R.compose(
      R.mapObjIndexed(R.uniq),
      R.reduce(
        (index: Object, [key, id]) => ({
          ...index,
          [key]: [...(index[key] || []), id]
        }),
        table._index || {}
      ),
      R.map(x => [x[indexedBy], x[idProp]])
    )(filteredUpdates);

    return table.merge(
      { ...updateObject, _index: indexUpdates },
      { deep: true }
    );
  }

  return table.merge(updateObject, { deep: true });
};

const makeNodeTable = (
  actions: () => Object,
  tableName: string,
  idProp: string = "id",
  indexedBy: string | null = null
): Array<any> => {
  return [
    Immutable.from({}),
    PropTypes.object,
    {
      [actions.update]: (s, p) =>
        p.nodeType === tableName
          ? updateTable(s, p.nodes, p.idProp ? p.idProp : idProp, indexedBy)
          : s,
      [actions.updateEntry]: (s, { nodeType, id, update }) =>
        nodeType === tableName ? updateEntry(s, id, update) : s,
      [actions.multiUpdate]: (s, updates) =>
        tableName in updates
          ? updateTable(s, updates[tableName], idProp, indexedBy)
          : s,
      [actions.removeEntries]: (s, { nodeType, ids }) =>
        nodeType === tableName ? removeEntries(s, ids) : s
    }
  ];
};

export default kea({
  path: () => ["scenes", "NodeDB"],

  actions: () => ({
    update: (nodeType, nodes, idProp) => ({ nodeType, nodes, idProp }),
    updateEntry: (nodeType, id, update) => ({ nodeType, id, update }),
    multiUpdate: updates => updates,
    removeEntries: (nodeType, ids) => ({ nodeType, ids })
  }),

  reducers: ({ actions }) => ({
    users: makeNodeTable(actions, "users", "id"),
    products: makeNodeTable(actions, "products"),
    articles: makeNodeTable(actions, "articles", "articleId"),
    brands: makeNodeTable(actions, "brands"),
    images: makeNodeTable(actions, "images", "image_id", "product_id"),
    influencers: makeNodeTable(actions, "influencers"),
    ingredients: makeNodeTable(
      actions,
      "ingredients",
      "ingredient_id",
      "product_id"
    ),
    ingredientStats: makeNodeTable(actions, "ingredientStats", "subcategory"),
    mentions: makeNodeTable(actions, "mentions", "video_id"),
    reviews: makeNodeTable(actions, "reviews", "review_id"),
    subcategories: makeNodeTable(actions, "subcategories"),
    videos: makeNodeTable(actions, "videos", "id"),
    searches: makeNodeTable(actions, "searches", "id"),
    subgraphs: makeNodeTable(actions, "subgraphs"),
    //=====[ UGC ]=====
    ugcPosts: makeNodeTable(actions, "ugcPosts", "id"),
    ugcComments: makeNodeTable(actions, "ugcComments", "id"),
    ugcImages: makeNodeTable(actions, "ugcImages", "id"),
    ugcCollections: makeNodeTable(actions, "ugcCollections", "id"),
    ugcCollectionItems: makeNodeTable(actions, "ugcCollectionItems", "id"),
    ugcPollResponses: makeNodeTable(actions, "ugcPollResponses", "id"),
    feeds: makeNodeTable(actions, "feeds", "id"),
    subgraphs: makeNodeTable(actions, "subgraphs", "id"),
    publications: makeNodeTable(actions, "publications", "id"),
    updates: makeNodeTable(actions, "updates", "id")
  })
});
