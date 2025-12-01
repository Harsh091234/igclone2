import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import { useInitUser } from "./utils/syncUser";
import { useSelector} from "react-redux";
import { selectUser } from "./features/user/userSlice";



const App = () => {
    const { user, isSignedIn, isLoaded } = useUser();
    const initUser = useInitUser();
    const authUser = useSelector(selectUser);

    //for auth user
    useEffect(()=> {
      console.log("auth user changed:", authUser);
    },[ [authUser]]);
    
    useEffect(() => {
   
    if (isSignedIn && user && isLoaded){
        
       initUser(user);
    } ;
      
     
    
  }, [isLoaded, isSignedIn, user]);

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
