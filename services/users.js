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

// 404? use this: https://users.roblox.com/docs#!/UserStatus/patch_v1_users_userId_status
export const updateStatus = ({ newStatus }) => {
  return request('POST', getBaseUrl() + '/home/updatestatus', {
    status: newStatus,
  }).then(d => d.data)
}