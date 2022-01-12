const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, path.sep + 'config.json');
if (!fs.existsSync(configPath)) {
  throw new Error('Configuration could not be found at location: ' + configPath);
}
const config = JSON.parse(fs.readFileSync(configPath).toString('utf-8'));

module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: config.serverRuntimeConfig,
  publicRuntimeConfig: config.publicRuntimeConfig,
  async redirects() {
    return [
      {
        source: '/catalog.aspx',
        destination: '/catalog',
        permanent: true,
      },
    ]
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config
  },
}
