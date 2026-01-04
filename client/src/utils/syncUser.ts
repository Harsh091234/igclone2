



import { useSyncUserMutation } from "../services/userApi";

export const useInitUser = () => {
  

  const [syncUser] =
    useSyncUserMutation();

  const initUser = async () => {
  
   
    try {
      await syncUser();

    } catch {
      // errors are already exposed via `error`
    }
  };
return initUser();
 
};