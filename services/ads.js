import request, { getBaseUrl, getFullUrl } from "../lib/request"

export const uploadAdvertisement = ({ file, name, targetId }) => {
  let formData = new FormData();
  formData.append('name', name);
  formData.append('files', file);
  return request('POST', getFullUrl('ads', '/v1/user-ads/assets/create?assetId=' + targetId), formData);
}


// Note: Endpoint is temporary until Roblox actually adds a "get ads" endpoint
export const getAds = ({ creatorId }) => {
  return request('GET', getFullUrl('ads', '/v1/user-ads/User/' + creatorId)).then(d => d.data);
}