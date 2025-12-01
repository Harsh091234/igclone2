import React, { Children, type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/user/userSlice'
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';


interface ProtectedRoutesProps {
  children: ReactNode;
}


const ProtectedRoutes = ({children}: ProtectedRoutesProps) => {
    const user = useSelector(selectUser);
    if(!user) return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-(--primary)" />
      </div>
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
