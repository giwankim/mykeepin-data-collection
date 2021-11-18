export interface MethodMetadataRes {
  network: string;
  registryAddress: string;
}

export default class MethodMetadata {
  private network: string;

  private registryAddress: string;

  constructor(res: MethodMetadataRes) {
    this.network = res.network;
    this.registryAddress = res.registryAddress;
  }

  getNetwork(): string {
    return this.network;
  }

  setNetwork(network: string) {
    this.network = network;
  }

  getRegistryAddress(): string {
    return this.registryAddress;
  }

  setRegistryAddress(registryAddress: string) {
    this.registryAddress = registryAddress;
  }
}
