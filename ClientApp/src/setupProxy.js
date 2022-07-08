const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:23178';

const context =  [
  "/weatherforecast",
  "/_configuration",
  "/.well-known",
  "/Identity",
  "/connect",
  "/ApplyDatabaseMigrations",
  "/_framework"
];

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  });

  app.use(
    createProxyMiddleware(["/AuthChatHub","/chatHub"], {
      target: "https://192.168.1.33:7268/",
      secure: false, // Needed to avoid DEPTH_ZERO_SELF_SIGNED_CERT error.
      logger: console,
      ws: true
    })
  );

  app.use(appProxy);
};
