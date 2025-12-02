import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { getAuthUser, syncUser } from "../features/user/userSlice";
import { useAuth } from "@clerk/clerk-react";
import type { UserResource } from "@clerk/types";

export const useInitUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessionId,getToken } = useAuth();

  const initUser = async (user: UserResource) => {
    const token = await getToken();
    if (!token) return;
    // console.log("token:", token)
    // console.log("id:", sessionId)
    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses[0]?.emailAddress;

    if (!email) return;

    // Try fetching user from DB first
    const res = await dispatch(getAuthUser(token));
  
     // CASE 1: Thunk rejected → error or server issue
    if (getAuthUser.rejected.match(res)) {
    
      await dispatch(syncUser({ token, email }));
      return;
    }

      // CASE 2: Fulfilled but user does not exist (payload === null)
    if (res.payload === null) {
     
      await dispatch(syncUser({ token, email }));
      return;
    }
    return;
  }
  return initUser;
};
