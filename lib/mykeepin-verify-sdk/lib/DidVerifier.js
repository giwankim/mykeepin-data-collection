/**
 * VP & vc verification sdk (node.js version 10.18.1)
 */
const debug = require('debug')('mykeepin-verify-sdk');
const didResolver = require('did-resolver');

const { crypto } = require('./utils');
const { verifyCredentials, getClaimsFromVcList } = require('./private');

const { generateNonce, decryptJwe } = crypto;

/**
 * Vp verifier constructor
 * @param {String} did VP issuer의 did
 * @param {Object} option Verifier options
 * @param {String=} [option.resolver=https://resolver.metadium.com//1.0] DID Resolver's url
 */
function DidVerifier(did, option = {}) {
  debug(`Initializing Verifier with ${did}, ${JSON.stringify(option, null, 4)}`);
  // Set did
  this.did = did;
  // Set resolver url (default is test resolver)
  this.resolver = option.resolver || 'https://resolver.metadium.com//1.0';
  // credential list
  this.vcList = [];
  // presentation object
  this.vp = {};
  // URL 끝에 / 가 없으면 붙인다.
  if (!this.resolver.endsWith('/')) this.resolver += '/';
  if (this.did === undefined) throw new Error('Verifier constructor error: need user did.');
  debug('Initialization finished');
}

// Public methods of Verifier class
DidVerifier.prototype = {
  extract,
  verifySignature,
  getPresentation,
  getCredentials,
  getClaims,
  findCredential,
};

/**
 * Auth 서버에서 전달 받은 encrypt 된 vp 를 decrypt 후 vp, vc 를 검증하고 vp, vc를 추출한다.
 * @param {String} jwePresentation Auth 서버에서 전달받은 암호화된 presentation
 * @param {Object} privateKey 서비스에서 생성한 RSA 개인키, 공개키는 Auth 서버에 등록
 * @public
 */
async function extract(jwePresentation, privateKey) {
  // Type 체크
  if (typeof jwePresentation !== 'string' || typeof privateKey !== 'object') throw new TypeError('Invalid argument(s)');

  debug('Extracting credential from RSA encrypted vp');
  // Decrypt JWE presentation with private key
  const jwsVp = await decryptJwe(jwePresentation, privateKey);
  // 복호화된 jws를 검증한다.
  const { verifiedVp, verifiedVcList } = await verifyCredentials.call(this, jwsVp);
  // 검증 결과를 저장
  this.vp = verifiedVp;
  this.vcList = verifiedVcList;
  debug('Extraction finished');
}

/**
 * Auth 서버에서 전달받은 signature를 검증하는 함수
 * @param {String} serviceId 발급받은 서비스 아이디
 * @param {String} state 인증 요청시 생성한 state 값
 * @param {String} code Auth 서버에서 발급된 code
 * @param {Number} type 인증 요청 시 type
 * @param {String} dataHash 인증 요청 시 data hash 값
 * @param {String} signature Auth 서버에서 전달받은 사용자 서명 값
 * @public
 */
async function verifySignature(serviceId, state, code, type, dataHash, signature) {
  // Type 체크
  if (typeof serviceId !== 'string' || typeof state !== 'string' || typeof code !== 'string'
  || typeof type !== 'number' || typeof dataHash !== 'string' || typeof signature !== 'string') throw new TypeError('Invalid argument(s)');

  debug(`Verifying signature ${signature}`);
  try {
    const { resolver, did } = this;
    // Make nonce with parameters
    const nonce = generateNonce(serviceId, state, code, type, dataHash);
    // Get did document
    const didDocument = await didResolver.getDocument(did, resolver, false);
    debug(`Verifying signature ${signature} finished`);
    // DID document 안에 address가 있는지 여부를 반환
    return didDocument.hasRecoverAddressFromSignature(did, serviceId, nonce, signature);
  } catch (err) {
    // 에러 발생 시 false 반환
    debug('Error occured while signature verification: ', err.message);
    return false;
  }
}

/**
 * Verify 된 vc들을 반환한다.
 * @return {Array}
 * @public
 */
function getCredentials() {
  debug('Get vc list');
  return this.vcList;
}

/**
 * Verify 된 vp를 반환한다.
 * @return {Object}
 * @public
 */
function getPresentation() {
  debug('Get decrypted vp');
  return this.vp;
}

/**
 * VP에서 claim만 리스트로 가져오는 함수
 * @param {Object} presentationInfo Presentation에 대한 정보
 * @param {Object} option 옵션
 * @param {Boolean} option.verifyByIssuer JTI 확인 옵션
 * @returns {Array} Array of claims
 * @public
 */
async function getClaims(presentationInfo, option = { verifyByIssuer: false }) {
  // Type 체크
  if (typeof presentationInfo !== 'object' || (option && typeof option !== 'object')) throw new TypeError('Invalid argument(s)');

  const claims = await getClaimsFromVcList.call(this, presentationInfo, option);
  return claims;
}

/**
 * 나열된 vc 들 중에 주어진 issuer의 DID와 credential의 이름으로 vc를 조회한다.
 * @param {String} issuerDid VC issuer의 did
 * @param {String} credentialName NameCredential 등 vc type
 * @return 조회된 vc, 조건에 맞는 vc가 없는 경우 undefined 반환
 * @public
 */
function findCredential(issuerDid, credentialName) {
  // Type 체크
  if (typeof issuerDid !== 'string' || typeof credentialName !== 'string') throw new TypeError('Invalid argument(s)');

  debug(`Finding one ${credentialName} from vc list with ${issuerDid}`);
  // issuer did 가 동일하고 vc type이 동일한지 확인한다.
  return this.vcList.find((vc) => {
    if (vc.vc && vc.vc.type) return vc.iss === issuerDid && vc.vc.type[1] === credentialName;
    return false;
  });
}

module.exports = DidVerifier;
