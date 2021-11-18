/**
 * Protected method들을 모아놓은 파일입니다.
 */
const debug = require('debug')('mykeepin-verify-sdk');
const verifyVp = require('./verifyVp');
const verifyVc = require('./verifyVc');
const getClaimsFromVcList = require('./getClaimsFromVcList');

/**
 * JWS 형태의 vp를 verify 하고 vp 내부의 vc를 verify한다.
 * @param {String} jwsVp JWS 형태의 verified presentation
 * @param {String} did VP issuer의 did
 * @return {Promise<{Object, Object}>}
 * @private
 */
async function verifyCredentials(jwsVp) {
  debug('Verifying total credential');
  // Verify signed vp
  const verifiedVp = await verifyVp.call(this, jwsVp);
  // Get signed vc list from vp
  const jwsVcList = verifiedVp.vp.verifiableCredential;
  // Verify jws vc in jwsVcList
  const verifiedVcList = await Promise.all(jwsVcList.map(async (jwsVc) => {
    const verifiedVc = await verifyVc.call(this, jwsVc);
    return verifiedVc;
  }));
  debug('Verification finished');
  return { verifiedVp, verifiedVcList };
}

module.exports = {
  verifyCredentials, getClaimsFromVcList,
};
