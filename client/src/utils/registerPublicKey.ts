import { useSavePublicKeyMutation } from "../services/keysApi";
import { exportPublicKey } from "./crypto/crypto"

const [savePublicKey] = useSavePublicKeyMutation();

export async function registerPublicKey(
  myPublicKey: CryptoKey,
) {
  // Export public key to ArrayBuffer → base64
  const rawPublicKey = await exportPublicKey(myPublicKey);
  const publicKeyBase64 = btoa(
    String.fromCharCode(...new Uint8Array(rawPublicKey)),
  );

  await savePublicKey(publicKeyBase64).unwrap(); // call your API
}
