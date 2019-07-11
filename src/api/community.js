import { create } from "apisauce";
import endpoints from "./endpoints";
import { authenticated, getToken } from "./utils";

//#############################################################################
//# SETUP
//#############################################################################

const api = create({
  baseURL: endpoints.communityServer,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json"
  }
});

// if (__DEV__) {
//   api.addMonitor(response =>
//     console.log("CommunityServer API Response: ", response)
//   );
// }

//#############################################################################
//# METHODS
//#############################################################################
export const getFeed = (topicId, offset) =>
  authenticated(api.get, `/feed/${topicId}`, { page: offset });
export const getTopics = () => authenticated(api.get, "/topics");
export const getPost = nodeId => authenticated(api.get, `/ugc/post/${nodeId}`);
export const toggleUGCLike = ({ nodeId, nodeType, valence }) =>
  authenticated(api.post, "/ugc/like", {
    nodeId,
    nodeType,
    valence
  });
export const createPollResponse = ({ nodeId, value }) =>
  authenticated(api.post, "/ugc/poll_response", {
    nodeId,
    value
  });
export const createUGCComment = ({
  commentId,
  body,
  parentId,
  parentNodeType
}) =>
  authenticated(api.post, "/ugc/comment", {
    commentId,
    body,
    parentId,
    parentNodeType
  });
export const deleteUGCComment = ({ commentId, parentId, parentNodeType }) =>
  authenticated(api.delete, "/ugc/comment", {
    commentId,
    parentId,
    parentNodeType
  });
export const reportUGC = ({ id, nodeId, nodeType }) =>
  authenticated(api.post, "/ugc/report", {
    id,
    nodeId,
    nodeType
  });

//#############################################################################
//# POSTING FLOW
//#############################################################################

export const createUGCPost = ({
  id,
  title,
  body,
  type = "text",
  pollOptions,
  imageIds = [],
  topicIds = [],
  linkUrl = null,
  productIds = [],
  pollType = "text"
}) =>
  authenticated(api.post, "/ugc/post", {
    id,
    type,
    title,
    body,
    imageIds,
    topicIds,
    productIds,
    linkUrl,
    ...(type === "poll" ? { pollType, pollOptions } : {})
  });
export const deleteUGCPost = ({ id }) =>
  authenticated(api.delete, "/ugc/post", {
    id
  });

//#############################################################################
//# CONTENT UPLOADS
//#############################################################################

const getFileType = uri => {
  const suffix = uri
    .split(".")
    .slice(-1)[0]
    .toLowerCase();
  if (suffix === "png") return "png";
  else return "jpeg";
};

/* Function: uploadImage
 * ---------------------
 * expects an imageUpload object
 */
export const uploadImage = ({ uri, fileType, imageId }) => {
  // Get filetype
  if (!fileType) {
    fileType = getFileType(uri);
  }

  // Create form data
  let formData = new FormData();
  formData.append("image", {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`
  });
  formData.append("imageId", imageId);
  let headers = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${getToken()}`
  };

  // Upload
  return api.post(endpoints.communityServer + "/ugc/image", formData, {
    headers
  });
};
