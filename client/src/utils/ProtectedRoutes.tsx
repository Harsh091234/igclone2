import React, { Children, type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/user/userSlice'
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import CenterLoading from '../components/CenterLoading';


interface ProtectedRoutesProps {
  children: ReactNode;
}


const ProtectedRoutes = ({children}: ProtectedRoutesProps) => {
    const user = useSelector(selectUser);
    if(!user) return (
      <CenterLoading />
    );
    if(!user.isProfileComplete){
        return <Navigate to={"/onboarding"} replace />
    }
     if (user.isProfileComplete && location.pathname === "/onboarding") {
       return <Navigate to="/" replace />;
     }
  return <>{children}</>
}

export default ProtectedRoutes
