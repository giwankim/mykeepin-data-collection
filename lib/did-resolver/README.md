# did-resolver-js-client

## Get it

#### import

```javascript
import resolver from 'did-resilver';
```

#### require

```javascript
const resolver = require('did-resolver').default;
```

## Use it

#### Get DID Document

```javascript
const TEST_DID =
  'did:meta:testnet:000000000000000000000000000000000000000000000000000000000000054b';
const didDocument = await resolver.getDocument(TEST_DID);
```

#### Get public key in document

```javascript
const TEST_DID =
  'did:meta:testnet:000000000000000000000000000000000000000000000000000000000000054b';
const didDocument = await resolver.getDocument(TEST_DID);

// retrieve public key
didDocument.getPublickey().forEach(key => {
  // key.getPublicKeyHex() or getPublicKeyHash()
});

// Check public key from signature
const svc_id = (string of service id);
const message = (string of sign message);
const signature = (hex string of V+R+S to sign secp256k1);

const bContainsPublicKey = document.hasRecoverAddressFromSignature(message, signature);
const bContainsPublicKey = document.hasRecoverAddressFromSignature(TEST_DID, svc_id, message, signature);
```
