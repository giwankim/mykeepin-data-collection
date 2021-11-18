const ethJsUtil = require('ethereumjs-util');

/**
 * Compute public key from signature of secp256k1
 * @param message to sign
 * @param signature secp256k1 signature. hex string of V+R+S
 * @return ec public key
 */
export function publicKeyFromSignature(
  message: string,
  signature: string,
): Buffer {
  const sign = signature.startsWith('0x') ? signature.substr(2) : signature;
  const msg = Buffer.from(message);
  const megHash = ethJsUtil.keccak256(msg);

  const vrs = Buffer.from(sign, 'hex');
  if (vrs.length !== 65) throw new Error('signature must be 65 bytes');

  const r = vrs.slice(0, 32);
  const s = vrs.slice(32, 64);
  const v = vrs[64];

  return ethJsUtil.ecrecover(megHash, v, r, s);
}

export function toAddress(publicKey: Buffer): string {
  const addrBuf = ethJsUtil.pubToAddress(publicKey);
  return ethJsUtil.bufferToHex(addrBuf);
}

/**
 * Compute address of public key from signature of secp256k1
 * @param message to sign
 * @param signature secp256k1 signature. hex string of V+R+S
 * @return address
 */
export function addressFromSignature(
  message: string,
  signature: string,
): string {
  return toAddress(publicKeyFromSignature(message, signature));
}
