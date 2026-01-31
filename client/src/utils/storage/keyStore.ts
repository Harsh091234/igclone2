import { getKey, putKey } from "../indexedDb";

export async function savePrivateKey(key: CryptoKey) {
  await putKey("identity", key);
}
export async function getPrivateKey(): Promise<CryptoKey | null> {
  return await getKey("identity");
}
