import request, { getBaseUrl, getFullUrl } from "../lib/request"

export const uploadAsset = ({ name, assetTypeId, file }) => {
  let formData = new FormData();
  formData.append('name', name);
  formData.append('assetType', assetTypeId);
  formData.append('file', file);
  return request('POST', getBaseUrl() + '/develop/upload', formData);
}

export const getCreatedAssetDetails = (assetIds) => {
  return request('POST', getFullUrl('itemconfiguration', '/v1/creations/get-asset-details'), {
    assetIds,
  })
}

export const getCreatedItems = ({ assetType, limit, cursor }) => {
  return request('GET', getFullUrl('itemconfiguration', '/v1/creations/get-assets?assetType=' + assetType + '&limit=' + limit + '&cursor=' + encodeURIComponent(cursor))).then(assets => {
    console.log(assets.data.data)
    if (assets.data.data.length !== 0) {
      return getCreatedAssetDetails(assets.data.data.map(v => v.assetId)).then(d => {
        assets.data.data = d.data.sort((a, b) => a.assetId > b.assetId ? -1 : 1)
        return assets.data;
      })
    }
    return assets.data;
  })
}