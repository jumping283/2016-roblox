import request, { getBaseUrl, getFullUrl } from "../lib/request"

export const uploadAsset = ({ name, assetTypeId, file }) => {
  let formData = new FormData();
  formData.append('name', name);
  formData.append('assetType', assetTypeId);
  formData.append('file', file);
  return request('POST', getBaseUrl() + '/develop/upload', formData);
}

export const uploadAssetVersion = ({assetId, file}) => {
  let form = new FormData();
  form.append('assetId', assetId);
  form.append('file', file);
  return request('POST', getBaseUrl() + '/develop/upload-version', form);
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

export const updateAsset = async ({assetId, name, description, genres, isCopyingAllowed, enableComments}) => {
  return await request('PATCH', getFullUrl('develop', `/v1/assets/${assetId}`), {
    name,
    description,
    genres,
    isCopyingAllowed,
    enableComments,
  });
}

export const setPriceRobux = async ({assetId, priceInRobux}) => {
  return await request('POST', getFullUrl('itemconfiguration', `/v1/assets/${assetId}/update-price`), {
    priceInRobux,
  })
}

export const getAllGenres = async () => {
  return (await request('GET', getFullUrl('develop', '/v1/assets/genres'))).data.data;
}