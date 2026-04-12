
import { useLogoutMutation } from '../services/authApi';
import CustomButton from '../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { setUser } from '../redux/authSlice';

const LogoutButton = () => {
  const [logout, {isLoading}] = useLogoutMutation();
  const dispatch = useDispatch<AppDispatch>();
const navigate = useNavigate();
const handleLogout = async () => {
  try {
    const res = await logout(undefined).unwrap();
    console.log("Logged out", res.message);
    dispatch(setUser(null));
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
