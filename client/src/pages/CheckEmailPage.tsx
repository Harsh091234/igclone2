
import { Link } from "react-router-dom";
import LeftSectionStartPage from "../components/LeftSectionStartPage";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";


export default function CheckEmailPage() {
  const user = useSelector((state: RootState) => state.auth.user);
   const navigate = useNavigate();
  
    
   return (
    <div className="h-screen flex ">
        <LeftSectionStartPage />
      <div className="text-center flex flex-col items-center justify-center w-full md:flex-1 h-full space-y-4">
        <h1 className="text-3xl font-medium">Please verify your email !</h1>
        <p className="text-muted-foreground text-lg">
          We have sent a verification link to your email.
        </p>

        <Link to="/resend-verification-url"className="
      relative inline-block text-foreground
      after:content-['']
      after:absolute after:h-[1.5px] after:w-full
      after:bg-foreground
      after:-bottom-0.5 after:right-0
      after:scale-x-0
      after:origin-right
      after:transition-transform after:duration-300
      hover:after:scale-x-100
      hover:after:origin-left
    ">
          Resend email
        </Link>


        <span className="text-sm text-muted-foreground">or</span>

  <Link
    to={user ? "/" : "/login"}
    className="
      relative inline-block text-foreground
      after:content-['']
      after:absolute after:h-[1.5px] after:w-full
      after:bg-foreground
      after:-bottom-0.5 after:right-0
      after:scale-x-0
      after:origin-right
      after:transition-transform after:duration-300
      hover:after:scale-x-100
      hover:after:origin-left
    "
  >
    {user ? "Back to Home" : "Back to Login"}
  </Link>
      </div>
    </div>
  );
}
