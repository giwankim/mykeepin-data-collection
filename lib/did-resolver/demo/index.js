const resolver = require('did-resolver');

const TEST_DID =
  'did:meta:testnet:0000000000000000000000000000000000000000000000000000000000000bd0';

async function demo() {
  const didDocument = await resolver.getDocument(TEST_DID);
  console.log(didDocument);

  const svc_id = '7e928682-4887-11ea-972f-0a0f3ad235f2';
  const message =
    '1402b3afb91287611e2b96e4f9fe0dbb5d5497ab31f0ee5f4f71dac7ad0b08b7';
  const signature =
    '0xe9ef471eba68dcd35f976459cbcf76934f02a8d0deb9088871d5aea34eef95e804fbd9fd023943819277e219baca5e692b2399abc1ed522e5b15a11b58bb09931b';

  const bContainsPublicKey = didDocument.hasRecoverAddressFromSignature(
    TEST_DID,
    svc_id,
    message,
    signature,
  );

  console.log(bContainsPublicKey);
}

demo();
