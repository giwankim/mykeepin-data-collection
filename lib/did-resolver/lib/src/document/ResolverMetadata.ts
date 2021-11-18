export interface ResolverMetadataRes {
  driverId: string;
  driver: string;
  retrieved: string;
  duration: string;
  cached: string;
  ttl: string;
}

export default class ResolverMetadata {
  private driverId: string;

  private driver: string;

  private retrieved: string;

  private duration: string;

  private cached: string;

  private ttl: string;

  constructor(res: ResolverMetadataRes) {
    this.driverId = res.driverId;
    this.driver = res.driver;
    this.retrieved = res.retrieved;
    this.duration = res.duration;
    this.cached = res.cached;
    this.ttl = res.ttl;
  }

  getDriverId(): string {
    return this.driverId;
  }

  setDriverId(driverId: string) {
    this.driverId = driverId;
  }

  getDriver(): string {
    return this.driver;
  }

  setDriver(driver: string) {
    this.driver = driver;
  }

  getRetrieved(): string {
    return this.retrieved;
  }

  setRetrieved(retrieved: string) {
    this.retrieved = retrieved;
  }

  getDuration(): string {
    return this.duration;
  }

  setDuration(duration: string) {
    this.duration = duration;
  }

  getCached(): string {
    return this.cached;
  }

  setCached(cached: string) {
    this.cached = cached;
  }

  getTtl(): string {
    return this.ttl;
  }

  setTtl(ttl: string) {
    this.ttl = ttl;
  }
}
