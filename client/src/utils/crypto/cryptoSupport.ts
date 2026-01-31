export function assertWebCrypto() {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Web Crypto API not supported in this browser");
  }
}
