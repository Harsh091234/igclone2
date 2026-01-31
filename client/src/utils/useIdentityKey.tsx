import { useEffect } from "react";
import { generateIdentityKeyPair, exportPublicKey } from "./crypto/crypto";
import {getKey, putKey} from "./indexedDb"
export function useIdentityKey(sendPublicKey: (key: ArrayBuffer) => void) {
  useEffect(() => {
    (async () => {
      let privateKey = await getKey("identity");

      if (!privateKey) {
        const keyPair = await generateIdentityKeyPair();
        await putKey("identity", keyPair.privateKey);

        const publicKey = await exportPublicKey(keyPair.publicKey);
        sendPublicKey(publicKey);
      }
    })();
  }, []);
}