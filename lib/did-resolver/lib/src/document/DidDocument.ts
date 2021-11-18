import * as sigUtils from '../util/signature';
import PublicKey, { PublickeyRes } from './PublicKey';
import Service, { ServiceRes } from './Service';

export interface DidDocumentRes {
  '@context': string;
  id: string;
  publicKey?: PublickeyRes[];
  authentication?: string[];
  service?: ServiceRes[];
}

export default class DidDocument {
  // eslint-disable-next-line react/static-property-placement
  private context: string;

  private id: string;

  private publicKey: PublicKey[];

  private authentication: string[];

  private service: Service[];

  constructor(res: DidDocumentRes) {
    this.context = res['@context'];
    this.id = res.id;
    this.publicKey = res.publicKey
      ? res.publicKey.map((key: PublickeyRes) => new PublicKey(key))
      : [];
    this.authentication = res.authentication ? [...res.authentication] : [];
    this.service = res.service
      ? res.service.map((svc: ServiceRes) => new Service(svc))
      : [];
  }

  getContext(): string {
    return this.context;
  }

  setContext(context: string) {
    this.context = context;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getPublicKey(): PublicKey[] {
    return this.publicKey;
  }

  setPublicKey(publicKey: PublickeyRes[]) {
    this.publicKey = publicKey.map(key => new PublicKey(key));
  }

  getAuthentication(): string[] {
    return this.authentication;
  }

  setAuthentication(authentication: string[]) {
    this.authentication = authentication;
  }

  getService(): Service[] {
    return this.service;
  }

  setService(service: ServiceRes[]) {
    this.service = service.map(svc => new Service(svc));
  }

  /**
   * Find public key of service
   * @param serviceId to find
   * @return find result
   */
  hasServicePublicKey(serviceId: string): boolean {
    const publicKeyVoList = this.getPublicKey();
    return publicKeyVoList.some((key: PublicKey) =>
      key.getId().includes(serviceId),
    );
  }

  /**
   * Get public key with key id
   * @param keyId
   * @return public key object
   */
  getOnePublicKey(keyId: string): PublicKey | null {
    const publicKeyVoList = this.getPublicKey();
    const pubKey = publicKeyVoList.find(
      (key: PublicKey) => key.getId() === keyId,
    );
    return pubKey || null;
  }

  /**
   * Find public key hash with address
   * @param address
   * @return find result
   */
  hasPublicKeyWithAddress(
    did: string,
    svc_id: string,
    address: string,
  ): boolean {
    const publicKeyVoList = this.getPublicKey();
    const addr = address.startsWith('0x') ? address.substr(2) : address;
    return publicKeyVoList.some(key => {
      const [did_id, svc_id_id, pubKey_id] = key.getId().split('#');
      if (did_id === did && svc_id_id === svc_id && pubKey_id === address) {
        const pubKeyHash = key.getPublicKeyHash();
        if (pubKeyHash && pubKeyHash === addr) return true;

        const pubKeyHex = key.getPublicKeyHex();
        if (pubKeyHex) {
          const publicKeyBytes = Buffer.from(pubKeyHex, 'hex');
          const publicKeyValue = sigUtils.toAddress(publicKeyBytes.slice(1));
          if (publicKeyValue === addr) return true;
        }
      }
      return false;
    });
  }

  /**
   * Find autg with address
   * @param did
   * @param svc_id
   * @param address
   * @return find result
   */
  hasAuthWithAddress(did: string, svc_id: string, address: string): boolean {
    const authenticationVoList = this.getAuthentication();
    const addr = address.startsWith('0x') ? address.substr(2) : address;

    return authenticationVoList.some((auth: string) => {
      const [did_auth, svc_id_auth, publicKeyHash] = auth.split('#');
      return (
        did_auth === did && svc_id_auth === svc_id && publicKeyHash === addr
      );
    });
  }

  /**
   * Get public keys of authentication
   * @return public key list
   */
  getPublicKeyOfAuthentication(): PublicKey[] {
    const ret: PublicKey[] = [];
    this.getAuthentication().forEach(kid => {
      const publicKey = this.getOnePublicKey(kid);
      if (publicKey) ret.push(publicKey);
    });
    return ret;
  }

  /**
   * verify signature and check if address is owned by did
   * @param did used when signing
   * @param svc_id used when signing
   * @param message used when signing
   * @param signature signature
   * @return if verified and is address of did owner, return true
   * @throws SignatureException
   */
  hasRecoverAddressFromSignature(
    did: string,
    svc_id: string,
    message: string,
    signature: string,
  ): boolean {
    const address = sigUtils.addressFromSignature(message, signature);
    return this.hasAuthWithAddress(did, svc_id, address);
  }
}
