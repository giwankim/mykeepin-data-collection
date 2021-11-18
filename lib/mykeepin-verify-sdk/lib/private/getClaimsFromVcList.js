const axios = require('axios');

/**
 * Presentation에 관한 정보를 읽어서 vc를 검사하고 vc 내부 claim을 모아 반환하는 함수
 * @param {Object} presentationInfo 특정 VP 와 연관된 정보
 * @returns {Array} List of claims
 */
async function getClaimsFromVcList(presentationInfo, option) {
  // Get members
  const { did, vcList } = this;

  // Parameter 체크
  if (!presentationInfo || !presentationInfo.vcs || !Array.isArray(presentationInfo.vcs)) throw new TypeError('Invalid argument.');
  if (!vcList || !Array.isArray(vcList)) throw new TypeError('Credentials are not extracted.');

  const requiredVcList = presentationInfo.vcs || [];

  // 필요한 vc들을 찾아서 검사 후 claim들을 모아놓은 리스트를 반환한다.
  return Promise.all(requiredVcList.map(async (requiredVc) => {
    const { vc: requiredVcType, did: issuerOfRequiredVc, name: nameOfRequiredClaim } = requiredVc;

    // 타입 체크
    if (typeof requiredVcType !== 'string' || typeof issuerOfRequiredVc !== 'string' || typeof nameOfRequiredClaim !== 'string') {
      throw new TypeError('JSON 파일의 vc, did, name 필드는 반드시 문자열이어야 합니다.');
    }

    // Verifier객체에 저장된 vc를 검색해서 가져옴
    const vc = this.findCredential(issuerOfRequiredVc, requiredVcType);
    // 필요한 vc를 찾을 수 없는 경우
    if (!vc) throw new Error(`${requiredVcType} is omitted`);
    return getClaimValueFromVc(await validateCredential(vc, did, option), nameOfRequiredClaim);
  })) || [];
}

/**
 * VC 가 valid한지 검사하는 함수
 * @param {Object} vc 검사하려는 VC
 * @param {String} did Subject of vc
 * @param {Object} option 검사 옵션
 * @param {Boolean} option.verifyByIssuer JTI 검사 여부
 */
async function validateCredential(vc, did, option) {
  const {
    sub, exp, jti,
  } = vc;
  const vcType = getTypeFromVc(vc);
  // VC subject 확인
  if (sub !== did) throw new Error(`${did} is not subject of ${vcType}`);
  // VC가 만료되었는지 확인
  const currentTime = new Date().getTime();
  if (exp && exp * 1000 < currentTime) throw new Error(`${vcType} is expired.`);
  // 옵션이 켜져 있으면 JTI 가 있는지 확인
  if (option && option.verifyByIssuer) {
    if (!jti) throw new Error(`${vcType} doesn't have JTI field`);
    // JTI 확인
    try {
      const { status } = await axios.get(jti);
      if (status !== 200) throw new Error(`${jti} responded with http status ${status}`);
    } catch (err) {
      throw new Error(`Error occured while requesting to ${jti}`);
    }
  }
  return vc;
}

/**
 * VC의 타입필드의 값을 가져오는 함수
 * @param {Object} vc 대상 VC
 */
function getTypeFromVc(vc) {
  if (!vc.vc || !vc.vc.type || !Array.isArray(vc.vc.type)) throw new TypeError('Invalid argument');
  // type 반환
  return vc.vc.type[1];
}

/**
 * VC의 claim 필드의 값을 가져오는 함수
 * @param {abc} vc 대상 VC
 * @param {abc} claim abc
 */
function getClaimValueFromVc(vc, claim) {
  if (!vc.vc || !vc.vc.credentialSubject || typeof vc.vc.credentialSubject !== 'object') throw new TypeError('Invalid argument');
  // claim 반환
  return vc.vc.credentialSubject[claim];
}

module.exports = getClaimsFromVcList;
