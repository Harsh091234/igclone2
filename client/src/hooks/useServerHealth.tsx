import { useEffect, useState } from "react";
import { useLazyHealthCheckQuery } from "../services/healthApi";

const MAX_WAIT_TIME = Number(import.meta.env.VITE_SERVER_WAIT_TIME) || 60000;

interface UseServerHealthReturn {
  serverReady: boolean;
  timedOut: boolean;
}

export const useServerHealth = (): UseServerHealthReturn => {
  const [serverReady, setServerReady] = useState<boolean>(false);
  const [timedOut, setTimedOut] = useState<boolean>(false);

  const [trigger] = useLazyHealthCheckQuery();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const startTime = Date.now();

    const checkServer = async () => {
      if (Date.now() - startTime >= MAX_WAIT_TIME) {
        clearInterval(interval);
        setTimedOut(true);
        return;
      }

      try {
        await trigger(undefined, true).unwrap();

        setServerReady(true);
        clearInterval(interval);
      } catch {
        console.log(
          `Waiting for server... ${Math.floor(
            (Date.now() - startTime) / 1000,
          )}s`,
        );
      }
    };

    checkServer();

    interval = setInterval(checkServer, 2000);

    return () => clearInterval(interval);
  }, [trigger]);

  return { serverReady, timedOut };
};
