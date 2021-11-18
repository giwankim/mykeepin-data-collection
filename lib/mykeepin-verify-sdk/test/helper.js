const ethereumjsabi = require('ethereumjs-abi');
const ethJsUtil = require('ethereumjs-util');
const { JWE, JWK } = require('node-jose');
const keypair = require('keypair');
const rsaPemToJwk = require('rsa-pem-to-jwk');

function generateNonce(serviceId, state, code, type, data) {
  const unprefixedData = data.startsWith('0x') ? data.substr(2) : data;
  const noncetype = ['string', 'string', 'uint', 'string', 'string'];
  const nonceArg = [code, serviceId, type, state, unprefixedData];
  const nonce = ethereumjsabi.soliditySHA3(noncetype, nonceArg).toString('hex');
  return nonce;
}

function generateSignature(serviceId, state, code, type, data, privateKey) {
  // Generate nonce
  const nonce = generateNonce(serviceId, state, code, type, data);
  // Generate nonce hash
  const nonceHash = ethereumjsabi.soliditySHA3(['string'], [nonce]).toString('hex');
  // Sign nonce with private key
  const { v, r, s } = ethJsUtil.ecsign(Buffer.from(nonceHash, 'hex'), Buffer.from(privateKey.substr(2), 'hex'));
  // Generate signature
  return ethJsUtil.toRpcSig(v, r, s);
}

async function encryptVp(srcVp) {
  const pair = keypair({ length: 2048 });
  const publicKey = await JWK.asKey(rsaPemToJwk(pair.private, 'public'));
  const privateKey = await JWK.asKey(rsaPemToJwk(pair.private, 'private'));
  const encryptedVp = await JWE.createEncrypt({ format: 'compact' }, publicKey).final(srcVp);
  return { encryptedVp, privateKey };
}

module.exports = {
  generateNonce, generateSignature, encryptVp,
};
