/**
 * This is example file.
 */

// Import sdk
const Verifier = require('../lib/DidVerifier');
const info = require('./info.json');

// 미리 설정된 값
const {
  resolver, sample,
} = require('./config');

// 테스트 샘플
const { did, encryptedVp, rsaPrivateKeyJwk } = sample;

// logging 함수
const { log } = console;

async function main() {
  try {
    // 사용자 DID 로 검증 객체 생성
    const verifier = new Verifier(did, { resolver });
    // 전달 받은 vp를 확인이 필요한 경우 vp 복호화 및 vp / vc 검증
    await verifier.extract(encryptedVp, rsaPrivateKeyJwk);

    log('[*] 전체 crednetial 조회');
    const vcList = verifier.getCredentials();
    log(JSON.stringify(vcList, null, 4));

    log('[*] Presentation 만 조회');
    const vp = verifier.getPresentation();
    log(vp);

    log('[*] 지정한 issuer 와 credential 이름으로 VC 조회.');
    const vc = verifier.findCredential('did:meta:testnet:00000000000000000000000000000000000000000000000000000000000003b1', 'NameCredential');
    log(vc);

    log('[*] Claim 만 조회');
    const vpInfo = info.find((vpVo) => vpVo.vp === 'UserPresentation');
    const claims = await verifier.getClaims(vpInfo, { verifyByIssuer: true });
    log(claims);
  } catch (err) {
    log(err);
  }
}

main();
