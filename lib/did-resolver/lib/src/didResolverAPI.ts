import axios, { AxiosError } from 'axios';

import DidResolver from './DidResolver';
import DidDocument from './document/DidDocument';

export const RESOLVER_URL = {
  TESTNET: 'https://testnetresolver.metadium.com/1.0/',
  MAINNET: 'https://resolver.metadium.com/1.0/',
};

/**
 * Request did document
 * @param did to search. did:meta:(testnet|mainnet):{meta_id}
 * @param noCache if true, did resolver does not cache did document
 * @return Did document. if not exists did or occur io error, return null
 */
export default function getDocument(
  did: string,
  resolver?: string | null,
  noCache: boolean = false,
): Promise<DidDocument | null> {
  const DID_reg = /^did:meta:((testnet|mainnet):)?[0-9a-f]{64}$/i;
  if (!DID_reg.test(did)) throw new Error('Did is not in the correct format');

  const defaultUrl = did.toLowerCase().startsWith('did:meta:testnet')
    ? RESOLVER_URL.TESTNET
    : RESOLVER_URL.MAINNET;
  const url = resolver || defaultUrl;
  const config = { headers: { 'no-cache': noCache.toString() } };

  return axios
    .get(`${url}identifiers/${did}`, config)
    .then(res => new DidResolver(res.data).getDidDocument() || null)
    .catch((err: AxiosError) => {
      if (err.response && err.response.status === 404) return null;
      throw err;
    });
}
