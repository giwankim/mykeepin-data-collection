const debug = require('debug')('mykeepin-verify-sdk:verifyVp');
const { JWT } = require('jose');
const didResolver = require('did-resolver');
const { crypto } = require('../utils');

const { makeJwkFromDidDocument } = crypto;

/**
 * Verify vp with did and checks whether vp's issuer is equal to did parameter.
 * @param {String} jwsVp vp is Verifiable Presentation that is wrapped by jws.
 * @return {Promise<Object>} verifiedVp
 */
async function verifyVp(jwsVp) {
  debug('Verifying VP');
  // DID resolver url
  const { resolver, did } = this;
  // Get did document from did
  const didDocument = await didResolver.getDocument(did, resolver, false);
  // Get jwk from did document
  const jwk = makeJwkFromDidDocument(didDocument);
  // Verify vp with jwk
  const verifiedVp = JWT.verify(jwsVp, jwk);
  debug('VP verfication finished');
  return verifiedVp;
}

module.exports = verifyVp;
