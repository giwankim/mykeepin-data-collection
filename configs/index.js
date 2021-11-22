const privateKey = require('./privateKeyJwks');

const mainnet = {
  // authServer: 'https://auth.mykeepin.com',
  service_id: '51678233-ea8b-47d8-8607-c70f8b0eafd1',
  resolver: 'https://resolver.metadium.com//1.0',
  privateKey,
  redirect_uri: 'http://13.124.121.133:3000/mykeepin/redirect1',
  type: 1,
  auth_request_url: 'https://auth.mykeepin.com/didauth/v1/authorize/view',
  verify_auth_info_url: 'https://auth.mykeepin.com/didauth/v1/verify',
  // mongo_uri: 'mongodb://localhost/auth',
  mongo_uri:
    'mongodb+srv://dbUser:DnzkpU5MwqhriBOH@kimchiprod.2jhth.mongodb.net/mykeepin-kimchi-demo?retryWrites=true&w=majority',
};

module.exports = mainnet;
