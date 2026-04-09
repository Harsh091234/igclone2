import React from 'react'
import { useLogoutMutation } from '../services/authApi';
import CustomButton from '../components/CustomButton';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const [logout, {isLoading}] = useLogoutMutation();
const navigate = useNavigate();
const handleLogout = async () => {
  try {
    await logout(undefined).unwrap();
    console.log("Logged out");
    navigate("/login");
  } catch (err: any) {
    console.log("Error logging out:", err?.data?.message || "Something went wrong!");
  }
};
  return (
    <CustomButton 
    onClick={handleLogout}
    loaderClasses='h-6 w-6'
    type='button'
    text="Logout"
    loading={isLoading}
    className='h-10'
    />
  )
}

export default LogoutButton
