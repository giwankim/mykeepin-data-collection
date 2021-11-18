const debug = require('debug')('mykeepin-verify-sdk:utils');
const { JWE, JWK } = require('node-jose');
const joseJWK = require('jose').JWK; /* node-jose 의 JWK와 구분하기 위해 다른 이름 (joseJWK)으로 추가함 */
const ethereumjsabi = require('ethereumjs-abi');
const ethJsUtil = require('ethereumjs-util');
const EcKey = require('ec-key');

/**
 * Private key를 이용해 JWE 문자열을 복호화하는 함수
 * @param {String} jweString JWE 문자열
 * @param {Object} privateKey RSA private key object
 * @return {String} jws string
 */
async function decryptJwe(jweString, privateKey) {
  debug('Decrypting JWE vp');
  const key = await JWK.asKey(privateKey);
  const decrypted = await JWE.createDecrypt(key).decrypt(jweString);
  debug('Decrypting JWE vp finished');
  return decrypted.payload.toString();
}

/**
 * Make jwk from did document.
 * @param {Object} didDocument didDocument is did document corresponds to specific did
 * @return {Object} jwk JWK object
 * @public
 */
function makeJwkFromDidDocument(didDocument) {
  debug('Making JWK from did document');
  // Get public key
  let { publicKeyHex } = didDocument.publicKey[0];
  const { id } = didDocument.publicKey[0];
  // Rip prefix '04'
  publicKeyHex = publicKeyHex.substr(2);
  // Make jwk with public key
  const hexX = publicKeyHex.substr(0, 64);
  const hexY = publicKeyHex.substr(64);
  const ecKey = new EcKey({
    kty: 'EC',
    crv: 'secp256k1',
    x: Buffer.from(hexX, 'hex'),
    y: Buffer.from(hexY, 'hex'),
  });
  const jwk = Object.assign(ecKey.toJSON(), {
    id,
    alg: 'ES256K',
    use: 'sig',
    crv: 'secp256k1',
  });
  debug('Making JWK from did document finished');
  // Return generated jwk
  return joseJWK.asKey(jwk); /* 주의: node-jose의 JWK가 아닌 jose의 JWK 메소드를 사용함 */
}

/**
 * Auth 서버에서 전달받은 signature를 검증하기 위해 필요한 nonce를 생성하는 함수
 * @param {String} serviceId 발급받은 서비스 아이디
 * @param {String} state 인증 요청시 생성한 state 값
 * @param {String} code Auth 서버에서 발급된 code
 * @param {Number} type 인증 요청 시 type
 * @param {String} data 인증 요청 시 data hash 값
 */
function generateNonce(serviceId, state, code, type = 0, data = '') {
  debug('Generating nonce');
  // Rip prefix 0x from data
  const unprefixedData = data.startsWith('0x') ? data.substr(2) : data;
  // Generate nonce
  const noncetype = ['string', 'string', 'uint', 'string', 'string'];
  const nonceArg = [code, serviceId, type, state, unprefixedData];
  const nonce = ethereumjsabi.soliditySHA3(noncetype, nonceArg).toString('hex');
  return nonce;
}

/**
 * Signature 를 ec recover 하여 address를 추출하는 함수
 * @param {String} message 서명한 데이터
 * @param {String} signature 서명값
 * @return {String} Address of user
 */
function recoverAddressFromSignature(message, signature) {
  debug(`Changing signature to address: ${signature}`);
  // Rip prefix 0x
  const unprefixedSignature = signature.startsWith('0x') ? signature.substr(2) : signature;
  // Signature VRS 나누기
  const vrs = Buffer.from(unprefixedSignature, 'hex');
  const r = vrs.slice(0, 32);
  const s = vrs.slice(32, 64);
  const v = vrs[64];
  // Get message hash from message
  const messageHash = ethereumjsabi.soliditySHA3(['string'], [message]);
  // Get public key by ec-recover
  const pubKey = ethJsUtil.ecrecover(Buffer.from(messageHash, 'hex'), v, r, s);
  // Change public key to address
  const addrBuf = ethJsUtil.pubToAddress(pubKey);
  const address = ethJsUtil.bufferToHex(addrBuf);
  debug(`Changing signature to address: ${signature} -> ${address}`);
  return address;
}

module.exports = {
  makeJwkFromDidDocument,
  decryptJwe,
  generateNonce,
  recoverAddressFromSignature,
};
