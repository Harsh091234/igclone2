import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../services/authApi";
import { useEffect, useState } from "react";


const VerifyEmailPage = () => {
 const navigate = useNavigate();
 const [message, setMessage] = useState<string | null>(null);
const [type, setType] = useState<"success" | "error" | null>(null);
  const { token } = useParams();


   const [verifyEmail, { isLoading }] =
    useVerifyEmailMutation();



useEffect(() => {
 
      if(!token) return;
  const verify = async () => {
    try {
      // ✅ If token exists → ALWAYS verify first
  
        await verifyEmail(token).unwrap();

        setMessage("Email Verified Successfully");
        setType("success");

        setTimeout(() => navigate("/"), 4000);
        return;
     
      // ✅ No token → fallback check
    
    } catch (error: any) {
      const msg = error?.data?.message;
console.log("Error verifying error", msg || "Something went wrong")
  // ✅ Treat already verified as success

  

  // ❌ Real error
  setMessage(msg || "Invalid or expired verification link");
  setType("error");
  
    }
  };

  verify();
}, [token, verifyEmail, navigate]);
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-800">
        <CardContent className="flex h-[18rem] flex-col items-center justify-center text-center p-8 space-y-6">
           {/* 🔄 Loading */}
          {isLoading && !type && (
            <div style={{ animationDuration: "1s" }} className="animate-pulse flex space-x-2">
              <Loader2  style={{ animationDuration: "1s" }} className="text-gray-600 text-xl dark:text-gray-300 h-8 w-8  animate-spin  " />
              <p   className="text-gray-600 text-xl dark:text-gray-300">
              
                 
                 Verifying your email... 
              </p>
               

            </div>
          )}

          {/* ✅ Success */}
          { type === "success" && (
            <>
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>

             <p className="text-sm text-gray-600 dark:text-gray-400">
  {message}
</p>

<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
  Redirecting in 4 seconds...
</p>
            </>
          )}

         {/* ❌ Error */}
{type === "error" && (
  <>
    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
      <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
    </div>

    <p className="text-sm text-gray-600 dark:text-gray-400">
      {message}
    </p>

    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Please try again
    </p>

    <Button
      onClick={() => navigate("/resend-verification-url")}
      className="w-full mt-2 bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900"
    >
      Resend Link
    </Button>
  </>
)}
       

        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyEmailPage
