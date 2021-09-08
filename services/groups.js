import axios from "axios";
import request, { getFullUrl } from "../lib/request"

export const getUserGroups = ({ userId }) => {
  return request('GET', getFullUrl('groups', `/v1/users/${userId}/groups/roles`)).then(d => d.data.data);
}

export const getPermissionsForRoleset = ({ groupId, rolesetId }) => {
  return request('GET', getFullUrl('groups', `/v1/groups/${groupId}/roles/${rolesetId}/permissions`)).then(d => d.data);
}

export const joinGroup = ({ groupId }) => {
  return request('POST', getFullUrl('groups', `/v1/groups/${groupId}/users`));
}

export const leaveGroup = ({ groupId, userId }) => {
  return request('DELETE', getFullUrl('groups', `/v1/groups/${groupId}/users/${userId}`));
}

export const setStatus = ({ groupId, message }) => {
  return request('PATCH', getFullUrl('groups', `/v1/groups/${groupId}/status`), {
    message,
  });
}

export const createGroup = ({ name, description, iconElement }) => {
  const f = new FormData();
  f.append('name', name);
  f.append('description', description);
  f.append('icon', iconElement.files[0]);
  return request('POST', getFullUrl('groups', `/v1/groups/create`), f).then(d => d.data);
}

export const getRoles = ({ groupId }) => {
  return request('GET', getFullUrl('groups', `/v1/groups/${groupId}/roles`)).then(d => d.data.roles);
}

export const getRolesetMembers = ({ groupId, roleSetId, cursor, limit = 10 }) => {
  return request('GET', getFullUrl('groups', `/v1/groups/${groupId}/roles/${roleSetId}/users?cursor=${encodeURIComponent(cursor || '')}&limit=${limit}`)).then(d => d.data);
}

export const getWall = ({ groupId, cursor, sort, limit }) => {
  return request('GET', getFullUrl('groups', `/v2/groups/${groupId}/wall/posts?sortOrder=${sort}&limit=${limit}&cursor=${encodeURIComponent(cursor || "")}`)).then(d => d.data);
}

export const postToWall = ({ groupId, content }) => {
  return request('POST', getFullUrl('groups', `/v1/groups/${groupId}/wall/posts`), {
    body: content,
  })
}

export const deletePost = ({ groupId, postId }) => {
  return request('DELETE', getFullUrl('groups', `/v1/groups/${groupId}/wall/posts/${postId}`))
}

export const getInfo = ({ groupId }) => {
  return request('GET', getFullUrl('groups', `/v1/groups/${groupId}`)).then(d => d.data);
}

export const claimGroupOwnership = ({ groupId }) => {
  return request('POST', getFullUrl('groups', `/v1/groups/${groupId}/claim-ownership`))
}

export const setGroupAsPrimary = ({ groupId }) => {
  return request('POST', getFullUrl('groups', `/v1/user/groups/primary`), { groupId })
}

export const removePrimaryGroup = () => {
  return request('DELETE', getFullUrl('groups', `/v1/user/groups/primary`))
}

export const getPrimaryGroup = ({ userId }) => {
  return request('GET', getFullUrl('groups', `/v1/users/${userId}/groups/primary/role`)).then(d => d.data);
}