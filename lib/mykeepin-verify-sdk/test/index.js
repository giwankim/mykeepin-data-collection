const { describe, it, before } = require('mocha');
const chai = require('chai');
const Verifier = require('../index.js');
const {
  serviceId, resolver, sample,
} = require('./config');
const info = require('./info.json');
const { generateSignature } = require('./helper');

chai.use(require('chai-as-promised'));

const { expect } = chai;

// Verifier 생성자 테스트
describe('Verifier construction test', () => {
  const { did } = sample;
  // DID 와 옵션 (resolver url, service id)를 생성자에 넘겼을 때, verifier는 생성되어야 함
  it('Verifier should be constructed with did and options', () => {
    const verifier = new Verifier(did, { resolver });
    expect(verifier).to.not.be.an('undefined');
    expect(verifier).to.not.be.a('null');
  });
  // DID 만 생성자에게 넘겼을 때, verifier는 생성되어야 함
  it('Verifier should be constructed with did', () => {
    const verifier = new Verifier(did);
    expect(verifier).to.not.be.an('undefined');
    expect(verifier).to.not.be.a('null');
  });
});

// VP 검증 테스트
describe('VP verification test', () => {
  const { did, encryptedVp, rsaPrivateKeyJwk } = sample;
  const verifier = new Verifier(did, { resolver });
  before(async () => {
    await verifier.extract(encryptedVp, rsaPrivateKeyJwk);
  });
  // VC 가 제대로 복호화되었는지 확인
  it('VC list should be generated', async () => {
    const vcList = verifier.getCredentials();
    expect(vcList).to.be.an('array');
    expect(vcList.length).to.be.above(0);
  });
  // VP가 제대로 복호화되었는지 확인
  it('VP should be generated', async () => {
    const vp = verifier.getPresentation();
    expect(vp).to.be.an('object');
  });
});

// 서명 검증 테스트
describe('Signature verification test', () => {
  // Sample datum
  const { signerDid, signerPrivateKey } = sample;
  const state = '96020727-ca11-4559-b018-5cf906b817f1';
  const code = '741908fd-6173-4be2-b42b-30dcde72bfb3';
  const type = 1;
  const data = '0xac3f539fd773266ea3052e1c81380242b209df42a7a6de46434d560f2e32d50b';
  // Generate signature
  const signature = generateSignature(serviceId, state, code, type, data, signerPrivateKey);
  // 서명한 사람의 did로 verifier 초기화
  const verifier = new Verifier(signerDid, { resolver });
  // 검증 성공 케이스
  it('Signature should be verified', async () => {
    // 서명 검증
    const verificationResult = await verifier.verifySignature(
      serviceId, state, code, type, data, signature,
    );
    expect(verificationResult).to.be.equal(true);
  });
  // 검증 실패 케이스 - 부적절한 서명
  it('Signature should not be verified with invalid signature', async () => {
    // 부적절한 서명
    const invalidSignature = signature.replace(signature[11], signature[11].concat('1'));
    // 서명 검증
    const verificationResult = await verifier.verifySignature(
      serviceId, state, code, type, data, invalidSignature,
    );
    expect(verificationResult).to.be.equal(false);
  });
  // 검증 실패 케이스 - 부적절한 resolver url
  it('Signature should not be verified with invalid signature', async () => {
    // 부적절한 resolver url 로 새로운 verifier 객체 생성
    const invalidVerifier = new Verifier(signerDid, { resolver: 'https://testnetresolver.metadium.com//1.0/identifiers' });
    // 서명 검증
    const verificationResult = await invalidVerifier.verifySignature(
      serviceId, state, code, type, data, signature,
    );
    expect(verificationResult).to.be.equal(false);
  });
});

// Getter 메소드 테스트
describe('Getter method test', () => {
  const { did, encryptedVp, rsaPrivateKeyJwk } = sample;
  const verifier = new Verifier(did, { resolver });
  before(async () => {
    await verifier.extract(encryptedVp, rsaPrivateKeyJwk);
  });
  it('getCredentials should return array', () => {
    const vcList = verifier.getCredentials();
    expect(vcList).to.be.an('array');
  });
  it('getPresentation should return object', () => {
    const vp = verifier.getPresentation();
    expect(vp).to.be.an('object');
  });
  it('findCredential should return object', () => {
    const vc = verifier.findCredential('did:meta:testnet:00000000000000000000000000000000000000000000000000000000000003b1', 'NameCredential');
    expect(vc).to.be.an('object');
  });
  it('getClaims should return list', async () => {
    const vpInfo = info.find((vpVo) => vpVo.vp === 'UserPresentation');
    const claims = await verifier.getClaims(vpInfo, { verifyByIssuer: true });
    expect(claims).to.be.an('array');
  });
});

// 에러 케이스 테스트
describe('Error case', () => {
  // DID 없이 생성자 호출 시 에러 발생해야 함
  it('Verifier should not be constructed without did', () => {
    try {
      const verifier = new Verifier(); // No did input.
      expect(verifier).to.be.an('undefined');
    } catch (err) {
      expect(err.message).to.equal('Verifier constructor error: need user did.');
    }
  });
  // Invalid resolver url
  it('Should fail with invalid resolver url', async () => {
    const { did, encryptedVp, rsaPrivateKeyJwk } = sample;
    const verifier = new Verifier(did, {
      resolver: 'https://testnetresolver.MMetadium.com//1.0', // Wrong did resolver
    });
    // Expect to throw error
    await expect(
      verifier.extract(encryptedVp, rsaPrivateKeyJwk),
    ).to.be.rejectedWith(Error);
  });
});
