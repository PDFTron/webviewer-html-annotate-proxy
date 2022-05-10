const HTMLProxyServer = require('@pdftron/webviewer-html-proxy-server');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 3000;
const NODE_PORT = process.env.REACT_APP_NODE_PORT || 3100;

const OPTIONS = {
  SERVER_ROOT: `http://${process.env.SERVER_HOST}`,
  PORT: NODE_PORT,
  CORS_OPTIONS: {
    origin: [
      `http://localhost:${PORT}`,
      `http://first.mydomain.com:3000`,
      `http://second.mydomain.com:3001`,
    ], credentials: true
  },
  COOKIE_SETTING: { sameSite: 'lax' },
};

HTMLProxyServer.createServer(OPTIONS);
