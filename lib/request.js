import axios from 'axios';
import config from '../lib/config';
let _csrf = '';

const getFullUrl = (apiSite, fullUrl) => {
  return config.publicRuntimeConfig.backend.apiFormat.replace(/\{0\}/g, apiSite).replace(/\{1\}/g, fullUrl);
}

const getBaseUrl = () => {
  return config.publicRuntimeConfig.backend.baseUrl;
}

const getUrlWithProxy = (url) => {
  if (config.publicRuntimeConfig.backend.proxyEnabled)
    return 'http://localhost:3000/api/proxy?url=' + encodeURIComponent(url);
  return url;
}

const request = async (method, url, data) => {
  try {
    let headers = {
      'x-csrf-token': _csrf,
    }
    // @ts-ignore
    if (!process.browser) {
      headers[config.serverRuntimeConfig.backend.authorizationHeader || 'authorization'] = config.serverRuntimeConfig.backend.authorization;
    }
    const result = await axios.request({
      method,
      url: getUrlWithProxy(url),
      data: data,
      headers: headers,
      maxRedirects: 0,
    });
    return result;
  } catch (e) {
    if (e.response) {
      let resp = e.response;
      if (resp.status === 403 && resp.headers['x-csrf-token']) {
        _csrf = resp.headers['x-csrf-token'];
        return await request(method, url, data);
      }
    }
    // @ts-ignore
    if (process.browser) {
      throw e;
    } else {
      throw new Error(e.message);
    }
  }
}

export default request;

export {
  getFullUrl,
  getBaseUrl,
  getUrlWithProxy,
}