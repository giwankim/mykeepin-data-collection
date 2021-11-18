# Method spec

mykeepin-verify-sdk 의 각 method의 spec을 정리한 문서입니다. 

## 목차
* [extract](#extract)
* [verifySignature](#verifySignature)
* [getCredentials](#getCredentials)
* [findCredential](#findCredential)
* [getPresentation](#getPresentation)

# DidVerifier (constructor)

## Description
검증 객체 생성자

## Parameters
| Name | Type | Description |
| --- | --- | --- |
| did | ```String``` | VP를 제시한, 또는 서명을 생성한 사용자의 did |
| option | ```Object``` | Verifier option |
| option.resolver | ```String``` | Did resolver 의 url |

## Return
| Type | Description |
| --- | --- |
| ```Object``` | Verifier 객체 |

# extract
### Description
암호화된 VP 를 복호화하고 VP 내부의 VC 목록을 추출하는 함수

### Parameters
| Name | Type | Description |
| --- | --- | --- |
| jwePresentation | ```String``` | Auth 서버에 등록된 rsa public key로 암호화된 VP |
| privateKey | ```Object``` | VP를 암호화할 때 사용한 rsa public key에 대응하는 rsa private key |

### Return
```none```, 만약 추출 중 문제가 생기면 에러를 throw 함.

# verifySignature
### Description
사용자의 서명값을 검증하는 함수

### Parameters
| Name | Type | Description |
| --- | --- | --- |
| serviceId | ```String``` | Auth 서버에 등록된 SP의 아이디 |
| state | ```String``` | 인증 요청 시 사용자가 생성한 state 값 |
| code | ```String``` | Auth 서버에서 발급된 code |
| type | ```String``` | 인증 요청시 사용자가 전달한 type |
| dataHash | ```String``` | 인증 요청시 사용자가 전달한 data hash 값 |
| signature | ```String``` | Auth 서버에서 전달받은, 사용자 서명 값

### Return
| Type | Description | 
| --- | --- |
| ```Boolean``` | 검증 성공 시 true, 실패 시 false 반환 |

# getCredentials
### Description
추출한 VC 목록을 반환하는 함수.  

### Parameters
```none```

### Return
| Type | Description |
| --- | --- |
| ```Array``` | 추출한 VC 목록

# findCredential
### Description
추출한 VC 목록 상에서 특정 vc를 찾아 반환하는 함수

### Parameters
| Name | Type | Description |
| --- | --- | --- |
| issuerDid | ```String``` | 찾고자 하는 credential을 발행한 사람의 did |
| credentialName | ```String``` | 찾고자 하는 credential의 이름 |

### Return
| Type | Description
| --- | --- |
| ```Object``` | VC 목록에서 찾아낸 VC. VC를 못찾으면 ```undefined``` 반환 |

# getPresentation
### Description
복호화한 VP를 반환하는 함수.  

### Parameter
```none```

### Return
| Type | Description |
| --- | --- |
| ```Object``` | 복호화한 VP |

# getClaims
### Description
VP 내부 claim들을 반환하는 함수

### Parameter
| Name | Type | Description |
| --- | --- | --- |
| presentationInfo | ```Object``` | 찾고자 하는 credential을 발행한 사람의 did |
| option | ```Object``` | 옵션 파라미터 |
| option.verifyByIssuer | ```Boolean``` | Issuer 서버를 거쳐서 credential을 검증할지를 결정하는 

### Return
| Type | Description |
| --- | --- |
| ```Array``` | Claim 리스트 |