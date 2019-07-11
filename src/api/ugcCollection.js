// @flow
import { create } from 'apisauce';
import endpoints from './endpoints';
import { authenticated } from './utils';

const api = create({
  baseURL: endpoints.ugcCollectionServer
});

// if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('Collection Server API Response: ', response)
//   );
// }

// getAllCollections: returns all ugcCollections and ugcCollectionItems for the current user
export const getAllCollections = () =>
  authenticated(api.get, '/all_collections');

// postItemToCollection: adds an item to a collection, returning updated ugcCollections
export const postItemToCollection = ({
  collectionItemId,
  collectionId,
  nodeId
}: {
  collectionItemId: string,
  collectionId: string,
  nodeId: string
}) =>
  authenticated(api.post, '/collection', {
    collectionItemId,
    collectionId,
    nodeId
  });

export const removeItemFromCollection = ({
  collectionItemId,
  collectionId,
  nodeId,
  type
}: {
  nodeId: string,
  collectionItemId?: string,
  collectionId?: string,
  type?: string
}) => {
  if (collectionId === 'pinned' || collectionId === 'tried') {
    type = collectionId;
  }
  return authenticated(api.delete, '/collection', {
    nodeId,
    collectionItemId,
    collectionId,
    type
  });
};
