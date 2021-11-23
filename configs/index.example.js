// const privateKey = require('./privateKeyJwks');

const mainnet = {
  service_id: '{{ your_uuid }}',
  resolver: 'https://resolver.metadium.com//1.0',
  // privateKey,
  redirect_uri: '{{ your_redirect_uri }}',
  type: 1,
  auth_request_url: 'https://auth.mykeepin.com/didauth/v1/authorize/view',
  verify_auth_info_url: 'https://auth.mykeepin.com/didauth/v1/verify',
  mongo_uri: '{{ your_mongodb_uri_for_user_documents }}',
};

module.exports = mainnet;
