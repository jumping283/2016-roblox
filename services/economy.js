import request from "../lib/request"
import { getFullUrl } from "../lib/request";


export const getResellers = ({ assetId, cursor, limit }) => {
  const url = getFullUrl('economy', '/v1/assets/' + assetId + '/resellers?limit=' + limit + '&cursor=' + encodeURIComponent(cursor || ''));
  return request('GET', url);
}

export const getRobux = ({ userId }) => {
  return request('GET', getFullUrl('economy', '/v1/users/' + userId + '/currency')).then(d => d.data);
}

export const getRobuxGroup = ({ groupId }) => {
  return request('GET', getFullUrl('economy', '/v1/groups/' + groupId + '/currency')).then(d => d.data);
}

export const getResellableCopies = ({ assetId, userId }) => {
  return request('GET', getFullUrl('economy', `/v1/assets/${assetId}/users/${userId}/resellable-copies`)).then(d => d.data);
}

export const purchaseItem = ({ productId, assetId, sellerId, userAssetId, price, expectedCurrency }) => {
  return request('POST', getFullUrl('economy', `/v1/purchases/products/${productId}`), {
    assetId,
    expectedPrice: price,
    expectedSellerId: sellerId,
    userAssetId,
  }).then(d => d.data);
}

export const setResellableAssetPrice = ({ assetId, userAssetId, price }) => {
  if (!Number.isSafeInteger(price) || price < 0 || isNaN(price)) {
    throw new Error('Invalid Price "' + price + '"');
  }
  return request('PATCH', getFullUrl('economy', `/v1/assets/${assetId}/resellable-copies/${userAssetId}`), {
    price,
  }).then(d => d.data);
}

export const takeResellableAssetOffSale = ({ assetId, userAssetId }) => {
  return setResellableAssetPrice({
    assetId,
    userAssetId,
    price: 0,
  });
}

export const getResaleData = ({ assetId }) => {
  return request('GET', getFullUrl('economy', `/v1/assets/${assetId}/resale-data`)).then(d => d.data);
}

export const getTransactions = ({ userId, cursor, type }) => {
  return request('GET', getFullUrl('economy', `/v2/users/${userId}/transactions?cursor=${encodeURIComponent(cursor || '')}&transactionType=${encodeURIComponent(type)}`)).then(d => d.data);
}

export const getTransactionSummary = ({ userId, timePeriod }) => {
  return request('GET', getFullUrl('economy', `/v2/users/${userId}/transaction-totals?timeFrame=${timePeriod}&transactionType=summary`)).then(d => d.data);
}