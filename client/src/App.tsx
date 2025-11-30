import { RedirectToSignIn, SignedIn, SignedOut, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { getAuthUser, syncUser } from "./features/user/userSlice";
import { Route, Routes } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";


const App = () => {
    // const { user, isSignedIn, isLoaded } = useUser();
    // const dispatch = useDispatch<AppDispatch>();
    // const {getToken} = useAuth();
    

    // useEffect(() => {
    // if (!isSignedIn || !user || !isLoaded) return;
  //   const initUser = async () => {
  //     // Try fetching user from DB first
  //     const token: string | null  = await getToken();
  //     const email =
  // user.primaryEmailAddress?.emailAddress ||
  // user.emailAddresses[0]?.emailAddress;
  //     if(!token) return;
  //     if(!email) return;
  //     const res = await dispatch(getAuthUser(token));
  //     if(res.type.endsWith("/fulfilled")){
  //       console.log("fetched auth user:", res);
  //       return;
  //     }
  //     //if not user then store user
  //      await dispatch(syncUser({token, email}));
  //   };

    
  //     initUser();
    
  // }, [isLoaded, isSignedIn, user]);

   return (
    <header>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        
      <SignedIn>
          <Routes>
         
    
        <Route path="/" element={<FeedPage />} />

        
        <Route path="profile/:userName" element={<ProfilePage />} />
      </Routes>
      
      </SignedIn>
    </header>
  );

}

export default App
