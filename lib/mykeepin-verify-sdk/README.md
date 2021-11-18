# MyKeepin SDK Verify for node.js
VP & VC verification 관련 node.js 용 라이브러리 입니다.

## 주요 기능
* SP로서 MyKeepin 앱에 요청한 서명 또는 VP를 검증

## SDK 추가
* ```node@v10.18.1``` 설치
* sdk 를 사용하고자 하는 node.js 프로젝트의 적절한 위치로 본 sdk (mykeepin-verify-sdk) 를 이동시킴
* did-resolver 를 mykeepin-verify-sdk와 같은 디렉토리로 이동시킴.
```
yourProject/
  package.json
  yourLibrary/
    mykeepin-verfy-sdk/
    did-resolver/
    ...
```
* sdk 를 사용하고자 하는 프로젝트의 ```package.json``` 파일에 수동으로 dependency 추가
```json
{
  "dependencies": {
    "mykeepin-verify-sdk": "file:path/to/mykeepin-verify-sdk",
  }
}
``` 
* Dependency 설치
```
$ npm i
```
* sdk import
```js
const Verifier = require('mykeepin-verify-sdk');
const verifier = new Verifier(...);
```

## 예제 파일 실행 방법
* mykeepin-verify-sdk 위치로 이동
```
$ cd path/to/mykeepin-verify-sdk
```
* Dependency 설치한 뒤 예제 시작
```
$ npm i
$ npm start
```

## 테스트 코드 실행 방법
* mykeepin-verify-sdk 위치로 이동
```
$ cd path/to/mykeepin-verify-sdk
```
* Dependency 설치한 뒤 테스트 시작
```
$ npm i
$ npm test
```

## Auth 서버에서 전달받은 VC 확인
```js
const encryptedVp = '' // RSA public key로 암호화된 vp
const privateKey = '' // RSA public key에 대응하는 private key
async function main() {
  try {
    // 사용자 DID 로 검증 객체 생성
    const verifier = new Verifier(did, {
      resolver: 'https://testnetresolver.metadium.com//1.0',
    });
    log('Verifying ...');
    // 전달 받은 vp를 확인이 필요한 경우 vp 복호화 및 vp / vc 검증
    await verifier.extract(encryptedVp, privateKey);
    // 전체 crednetial 조회
    const vcList = verifier.getCredentials();
    log(vcList);
    // 또는 지정한 issuer 와 credential 이름으로 VC 조회.
    const vc = verifier.findCredential('did:meta:testnet:0000...(생략)', 'DateOfBirthCredential');
    log(vc);
    }
  } catch (err) {
    log(err); // Extraction 에 문제가 있을 경우 어떤 문제가 있는지 출력
  }
}
```

## Auth 서버에서 전달받은 서명 검증
```js
// 미리 설정된 값
const serviceId = ''; // sp 의 service id
const userDid = ''; // 사용자 did
// 서버에 생성한 값 설정
const state = ''; // 인증 요청하기 위해 생성한 state
const type = 1; // 인증 요청 타입
const dataHash = ''; // 인증 요청한 데이터의 hash 값, 없으면 '' 넣기
// 앱에서 전달 받은 인증코드
const code = '';
// 서버에서 전달 받은 서명
const signature = '';

async function main() {
  // 사용자 DID로 검증 객체 생성
  const verifier = new Verifier(userDid, {
    resolver: 'https://testnetresolver.metadium.com//1.0',
  });
  // Signature를 검증한다.
  const verificationResult = await verifier.verifySignature(serviceId, state, code, type, dataHash, signature);
  log('Signature verification:', verificationResult);
}
```

## Directories
| Directory | description
|---|---|
| `docs` | API 플로우에 대한 문서를 저장하는 디렉토리 |
| `example` | 본 라이브러리의 사용 예제를 저장하는 디렉토리 
| `test` | 테스트 코드를 저장해 놓은 디렉토리
| `lib` | 본 라이브러리의 소스를 모아놓은 디렉토리
| `index.js` | 본 라이브러리의 entry 파일
| `README.md` | Readme file

## 제공하는 method 목록
| Name | description
|---|---|
| `extract` | 암호화된 vp와 vp내부의 vc목록을 검증하는 함수 
| `getCredentials` | 검증된 vc목록을 반환하는 함수  |
| `findCredential` | 검증된 vc목록에서 issuer와 credential 이름으로 특정 vc를 조회하는 함수 |
| `verifySignature` | Auth 서버로부터 전달받은 서명값을 검증하는 함수 |
| `getPresentation` | 검증된 vp를 반환하는 함수 |
| `getClaims` | claim 리스트를 반환하는 함수 |

## Method flow
[docs/flow.md](./docs/flow.md) 참조
