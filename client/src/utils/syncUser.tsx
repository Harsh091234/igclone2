import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { syncUser } from "../features/user/userSlice";
import type { AppDispatch } from "../store/store";

export default function SyncUserToBackend() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!user) return;

    (async () => {
      const token = await getToken();

      if (!token) return;

      const data = {
        email:
          user.primaryEmailAddress?.emailAddress ||
          user.emailAddresses[0]?.emailAddress,
      };
         const syncedUser = dispatch(syncUser({ token, data }));
      console.log("synced user:", syncedUser);
     
    })();
  }, [isSignedIn, user]);

  return null;
}
