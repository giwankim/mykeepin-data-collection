export interface ServiceRes {
  id: string;
  publicKey: string;
  type: string;
  serviceEndpoint: string;
}

export default class Service {
  private id: string;

  private publicKey: string;

  private type: string;

  private serviceEndpoint: string;

  constructor(res: ServiceRes) {
    this.id = res.id;
    this.publicKey = res.publicKey;
    this.type = res.type;
    this.serviceEndpoint = res.serviceEndpoint;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  setPublicKey(publicKey: string) {
    this.publicKey = publicKey;
  }

  getType(): string {
    return this.type;
  }

  setType(type: string) {
    this.type = type;
  }

  getServiceEndpoint(): string {
    return this.serviceEndpoint;
  }

  setServiceEndpoint(serviceEndpoint: string) {
    this.serviceEndpoint = serviceEndpoint;
  }
}
