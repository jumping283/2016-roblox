// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios').default;
import getConfig from 'next/config';

const actualHandler = async (req, res) => {
  if (getConfig().publicRuntimeConfig.backend.proxyEnabled !== true) {
    return res.status(500).json({
      success: false,
    });
  }
  try {
    let requestHeaders = {
      authorization: getConfig().serverRuntimeConfig.backend.authorization,
      cookie: req.headers['cookie'] || '',
      'x-csrf-token': req.headers['x-csrf-token'] || '',
      'user-agent': req.headers['user-agent'],
    }
    for (const key in req.headers) {
      if (key === 'host' || key === 'conneciton' || key === 'accept-encoding' || key === 'host') {
        continue;
      }
      requestHeaders[key] = req.headers[key];
    }
    console.log('[info] send request');
    const result = await axios.request({
      method: req.method,
      url: req.query.url,
      data: req.body,
      maxRedirects: 0,
      headers: requestHeaders,
      validateStatus: () => true,
    });
    console.log('[info] request sent')
    for (const item of Object.getOwnPropertyNames(result.headers)) {
      let value = result.headers[item];
      if (item === 'set-cookie') {
        // TODO: "localhost" needs to be configurable
        if (typeof value === 'string') {
          value = value.replace(/roblox\.com/g, 'localhost');
        } else {
          value.forEach((v, i, arr) => {
            arr[i] = v.replace(/roblox\.com/g, 'localhost');
          });
        }
      }
      res.setHeader(item, value);
    }
    res.status(result.status);
    res.json(result.data);
    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false
    })
    res.end();
  }
}

export default function handler(req, res) {
  let chunks = []
  req.on('data', function (chunk) {
    chunks.push(chunk);
  })
  req.on('end', function () {
    req.body = Buffer.concat(chunks);
    actualHandler(req, res);
  })

}

export const config = {
  api: {
    bodyParser: false,
  },
}
