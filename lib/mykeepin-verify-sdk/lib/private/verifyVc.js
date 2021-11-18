const debug = require('debug')('mykeepin-verify-sdk:verifyVc');
const { JWT } = require('jose');
const didResolver = require('did-resolver');
const { crypto } = require('../utils');

const { makeJwkFromDidDocument } = crypto;

/**
 * Verify vc with jwk and checks expiration date & subject of vc
 * @param {String} jwsVc vc is Verifiable Credntial
 * @return {Promise<Object>} Verified vc
 */
async function verifyVc(jwsVc) {
  debug('Verifying VC');
  // DID resolver url
  const { resolver } = this;
  // Get issuer's did from decoded vc
  const decodedVc = JWT.decode(jwsVc);
  const { iss } = decodedVc;
  // Get did document from issuer's did
  const didDocument = await didResolver.getDocument(iss, resolver, false);
  // Get jwk from did document
  const jwk = await makeJwkFromDidDocument(didDocument);
  // Verify vc
  const verifiedVc = JWT.verify(jwsVc, jwk);
  debug('VC verification finished');
  return verifiedVc;
}

module.exports = verifyVc;
