// src/lib/session.ts
import { importPublicKey, deriveSessionKey } from "./crypto/crypto";
import { getPrivateKey } from "./storage/keyStore";

const sessionCache = new Map<string, CryptoKey>();

export async function getSessionKey(
  conversationId: string,
  receiverRawKey: ArrayBuffer,
) {
  if (sessionCache.has(conversationId)) {
    return sessionCache.get(conversationId)!;
  }

  const myPrivateKey = await getPrivateKey();
  const receiverPublicKey = await importPublicKey(receiverRawKey);

  const sessionKey = await deriveSessionKey(myPrivateKey, receiverPublicKey);

  sessionCache.set(conversationId, sessionKey);
  return sessionKey;
}