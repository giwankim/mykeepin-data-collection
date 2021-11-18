export interface PublickeyRes {
  id: string;
  type: string;
  controller: string;
  publicKeyHex?: string;
  publicKeyHash?: string;
}

export default class PublicKey {
  private id: string;

  private type: string;

  private controller: string;

  private publicKeyHex: string | undefined;

  private publicKeyHash: string | undefined;

  constructor(res: PublickeyRes) {
    this.id = res.id;
    this.type = res.type;
    this.controller = res.controller;
    this.publicKeyHex = res.publicKeyHex;
    this.publicKeyHash = res.publicKeyHash;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getType(): string {
    return this.type;
  }

  setType(type: string) {
    this.type = type;
  }

  getController(): string {
    return this.controller;
  }

  setController(controller: string) {
    this.controller = controller;
  }

  getPublicKeyHex(): string | null {
    return this.publicKeyHex || null;
  }

  setPublicKeyHex(publicKeyHex: string) {
    this.publicKeyHex = publicKeyHex;
  }

  getPublicKeyHash(): string | null {
    return this.publicKeyHash || null;
  }

  setPublicKeyHash(publicKeyHash: string) {
    this.publicKeyHash = publicKeyHash;
  }
}
