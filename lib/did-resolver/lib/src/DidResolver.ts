import DidDocument, { DidDocumentRes } from './document/DidDocument';
import ResolverMetadata, {
  ResolverMetadataRes,
} from './document/ResolverMetadata';
import MethodMetadata, { MethodMetadataRes } from './document/MethodMetadata';

export interface DidResolverRes {
  redirect: object | null;
  didDocument: DidDocumentRes;
  resolverMetadata: ResolverMetadataRes;
  methodMetadata: MethodMetadataRes;
  success: boolean | undefined;
  message: string | undefined;
}

/**
 * DID resolver response data
 */
export default class DidResolver {
  private redirect: object | null;

  private didDocument: DidDocument;

  private resolverMetadata: ResolverMetadata;

  private methodMetadata: MethodMetadata;

  private success: boolean;

  private message: string;

  constructor(res: DidResolverRes) {
    this.redirect = res.redirect;
    this.didDocument = new DidDocument(res.didDocument);
    this.resolverMetadata = new ResolverMetadata(res.resolverMetadata);
    this.methodMetadata = new MethodMetadata(res.methodMetadata);
    this.success = res.success === undefined ? true : res.success;
    this.message = res.message === undefined ? '' : res.message;
  }

  getRedirect(): object | null {
    return this.redirect ? { ...this.redirect } : null;
  }

  setRedirect(redirect: object) {
    this.redirect = redirect;
  }

  getDidDocument(): DidDocument {
    return this.didDocument;
  }

  setDidDocument(didDocument: DidDocumentRes) {
    this.didDocument = new DidDocument(didDocument);
  }

  getResolverMetadata(): ResolverMetadata {
    return this.resolverMetadata;
  }

  setResolverMetadata(resolverMetadata: ResolverMetadataRes) {
    this.resolverMetadata = new ResolverMetadata(resolverMetadata);
  }

  getMethodMetadata(): MethodMetadata {
    return this.methodMetadata;
  }

  setMethodMetadata(methodMetadata: MethodMetadataRes) {
    this.methodMetadata = new MethodMetadata(methodMetadata);
  }

  getSuccess(): boolean {
    return this.success;
  }

  setSuccess(success: boolean) {
    this.success = success;
  }

  getMessage(): string {
    return this.message;
  }

  setMessage(message: string) {
    this.message = message;
  }
}
