export function publicKeyToArrayBuffer(publicKey: number[]): ArrayBuffer {
  return new Uint8Array(publicKey).buffer;
}
