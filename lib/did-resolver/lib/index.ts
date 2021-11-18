import getDocument, { RESOLVER_URL } from './src/didResolverAPI';
import DidResolver from './src/DidResolver';
import DidDocument from './src/document/DidDocument';
import MethodMetadata from './src/document/MethodMetadata';
import PublicKey from './src/document/PublicKey';
import ResolverMetadata from './src/document/ResolverMetadata';
import Service from './src/document/Service';
import * as signUtils from './src/util/signature';

export default {
  getDocument,
  RESOLVER_URL,
  DidResolver,
  DidDocument,
  MethodMetadata,
  PublicKey,
  ResolverMetadata,
  Service,
  signUtils,
};
