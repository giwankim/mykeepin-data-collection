const encryptedVp = require('./encryptedVp');
const rsaPrivateKeyJwk = require('./rsaPrivateKeyJwk');

module.exports = {
  // SP 서비스 아이디
  serviceId: 'f7c5b186-41b9-11ea-ab1a-0a0f3ad235f2',
  // Auth 서버 url
  authServer: 'https://testauth.metadium.com',
  // Testnet did resolver url
  resolver: 'https://testnetresolver.metadium.com//1.0',
  // 테스트용 샘플
  sample: {
    // VP issuer
    did: 'did:meta:testnet:0000000000000000000000000000000000000000000000000000000000000c2e',
    // rsaPublicKeyJwk 로 암호화된 vp
    encryptedVp,
    // 암호화된 vp를 복호화할 때 사용하는 private key
    rsaPrivateKeyJwk,
    // Signer did (서명 생성한 사용자의 did)
    signerDid: 'did:meta:testnet:00000000000000000000000000000000000000000000000000000000000009b4',
    // Signer private key (서명 생성할 때 사용)
    signerPrivateKey: '0x477cdbbe5a3774758e832ed99a3d91a5790090942d73a619aa6b223c4be014f5',
  },
};
