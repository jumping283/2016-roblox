import request, { getBaseUrl } from "../lib/request"
import { getFullUrl } from "../lib/request";

export const itemNameToEncodedName = (str) => {
  if (typeof str !== 'string') {
    str = '';
  }
  // https://stackoverflow.com/questions/987105/asp-net-mvc-routing-vs-reserved-filenames-in-windows
  var seoName = str.replace(/'/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(COM\d|LPT\d|AUX|PRT|NUL|CON|BIN)$/i, "") || "unnamed";
  return seoName;
}


export const searchCatalog = ({ category, subCategory, query, limit, cursor, sort }) => {
  return request('GET', getFullUrl('catalog', '/v1/search/items?category=' + category + '&subcategory=' + subCategory + '&keyword=' + encodeURIComponent(query || '') + '&limit=' + limit + '&cursor=' + encodeURIComponent(cursor || '') + '&sortType=' + sort)).then(d => d.data);
}

/**
 * Only use this on server-side requests.
 * @param {number} assetId 
 */
export const getProductInfoLegacy = async (assetId) => {
  return request('GET', getFullUrl('api', '/marketplace/productinfo?assetId=' + assetId)).then(d => d.data);
}

export const getItemDetails = async (assetIdArray) => {
  while (true) {
    try {
      const res = await request('POST', getFullUrl('catalog', '/v1/catalog/items/details'), {
        items: assetIdArray.map(v => {
          return {
            itemType: 'Asset',
            id: v,
          }
        })
      });
      for (const item of res.data.data) {
        if (typeof item.isForSale === 'undefined') {
          item.isForSale = (item.unitsAvailableForConsumption !== 0 && typeof item.price === 'number' && typeof item.lowestPrice === 'undefined');
        }
      }
      return res;
    } catch (e) {
      // @ts-ignore
      if (e.response && e.response.status === 429 && process.browser) {
        await new Promise((res) => setTimeout(res, 2500));
        continue;
      }
      throw e;
    }
  }
}

export const getRecommendations = ({ assetId, assetTypeId, limit }) => {
  return request('GET', getFullUrl('catalog', '/v1/recommendations/asset/' + assetTypeId + '?contextAssetId=' + assetId + '&numItems=' + limit)).then(d => d.data);
}

export const getComments = async ({ assetId, offset }) => {
  return request('GET', getBaseUrl() + '/comments/get-json?assetId=' + assetId + '&startIndex=' + offset + '&thumbnailWidth=100&thumbnailHeight=100&thumbnailFormat=PNG&cachebuster=' + Math.random()).then(d => d.data);
}

export const createComment = async ({ assetId, comment }) => {
  let result = await request('POST', getBaseUrl() + '/comments/post', {
    text: comment,
    assetId: assetId,
  });
  if (typeof result.data.ErrorCode === 'string') {
    throw new Error(result.data.ErrorCode);
  }
  return result.data;
}

export const addOrRemoveFromCollections = ({ assetId, addToProfile }) => {
  return request('POST', getBaseUrl() + '/asset/toggle-profile', {
    assetId,
    addToProfile,
  })
}