/* --------------------------------------------------
   WebCrypto utilities – SAFE ArrayBuffer handling
--------------------------------------------------- */

const IV_LENGTH = 12;

/* ---------- INTERNAL: force real ArrayBuffer ---------- */
function toArrayBuffer(input: ArrayBuffer | ArrayBufferView): ArrayBuffer {
  if (input instanceof ArrayBuffer) {
    return input.slice(0);
  }

  return input.buffer.slice(
    input.byteOffset,
    input.byteOffset + input.byteLength,
  );
}

/* ---------- KEY GENERATION ---------- */
export async function generateIdentityKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"],
  );
}

/* ---------- EXPORT / IMPORT PUBLIC KEY ---------- */
export async function exportPublicKey(
  publicKey: CryptoKey,
): Promise<ArrayBuffer> {
  return toArrayBuffer(await crypto.subtle.exportKey("raw", publicKey));
}

export async function importPublicKey(rawKey: ArrayBuffer): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    rawKey,
    {
      name: "ECDH",
      namedCurve: "X25519",
    },
    true,
    [],
  );
}

/* ---------- SESSION KEY DERIVATION ---------- */
export async function deriveSessionKey(
  myPrivateKey: CryptoKey,
  receiverPublicKey: CryptoKey,
): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: receiverPublicKey,
    },
    myPrivateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

/* ---------- IV ---------- */
export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/* ---------- ENCRYPT ---------- */
export async function encryptText(
  text: string,
  sessionKey: CryptoKey,
): Promise<{
  cipherText: Uint8Array;
  iv: Uint8Array;
}> {
  const iv = generateIV();

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sessionKey,
    new TextEncoder().encode(text),
  );

  return {
    cipherText: new Uint8Array(encrypted), // 👈 SAFE
    iv,
  };
}

/* ---------- DECRYPT ---------- */
export async function decryptText(
  cipherText: Uint8Array | ArrayBuffer,
  iv: Uint8Array,
  sessionKey: CryptoKey,
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: toArrayBuffer(iv),
    },
    sessionKey,
    toArrayBuffer(cipherText),
  );

  return new TextDecoder().decode(decrypted);
}

/* ---------- ENV CHECK ---------- */
export function assertWebCrypto() {
  if (!window.crypto?.subtle) {
    throw new Error("Web Crypto API not supported in this browser");
  }
}
