import request, { getBaseUrl } from "../lib/request"
import { getFullUrl } from "../lib/request";

const baseUrl = getFullUrl('users', '');

export const getMyInfo = () => {
  return request('GET', baseUrl + '/v1/users/authenticated').then(d => d.data)
}

export const getUserInfo = ({ userId }) => {
  return request('GET', baseUrl + '/v1/users/' + userId).then(d => d.data)
}

export const getUserStatus = ({ userId }) => {
  return request('GET', baseUrl + '/v1/users/' + userId + '/status').then(d => d.data)
}

export const updateStatus = ({ newStatus, userId }) => {
  return request('PATCH', getFullUrl('users', '/v1/users/' + userId + '/status'), {
    status: newStatus,
  }).then(d => d.data)
}

export const getPreviousUsernames = async ({ userId }) => {
  let cursor = '';
  let names = [];
  do {
    let results = await request('GET', getFullUrl('users', '/v1/users/' + userId + '/username-history?limit=100&cursor=' + encodeURIComponent(cursor)));
    results.data.data.forEach(v => names.push(v.name));
    cursor = results.data.nextPageCursor;
  } while (cursor !== null);
  return names;
}