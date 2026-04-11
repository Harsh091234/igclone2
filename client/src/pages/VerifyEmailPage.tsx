import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../services/authApi";
import { useEffect, useState } from "react";

const VerifyEmailPage = () => {
 const navigate = useNavigate();
  const { token } = useParams();
const [redirectTime, setRedirectTime] = useState(3);

   const [verifyEmail, { isLoading, isSuccess, isError }] =
    useVerifyEmailMutation();


   const demoVar = true;

   useEffect(() => {
  if (!isSuccess) return;

  if (redirectTime <= 0) {
    navigate("/onboarding");
    return;
  }

  const timer = setTimeout(() => {
    setRedirectTime((prev) => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [isSuccess, redirectTime]);

useEffect(() => {
  const verify = async () => {
    try {
      if (token) {
        await verifyEmail(token).unwrap();
      }
    } catch (error: any) {
      console.log(
        "Verification failed:",
        error?.data?.message || error?.message || "Something went wrong"
      );
    }
  };

  verify();
}, [token, verifyEmail]);


  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-800">
        <CardContent className="flex h-[18rem] flex-col items-center justify-center text-center p-8 space-y-6">
           {/* 🔄 Loading */}
          {isLoading && (
            <div style={{ animationDuration: "1s" }} className="animate-pulse flex space-x-2">
              <Loader2  style={{ animationDuration: "1s" }} className="text-gray-600 text-xl dark:text-gray-300 h-8 w-8  animate-spin  " />
              <p   className="text-gray-600 text-xl dark:text-gray-300">
              
                 
                 Verifying your email... 
              </p>
               

            </div>
          )}

          {/* ✅ Success */}
          { isSuccess && (
            <>
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                <CheckCircle className="h-10 w-10 text-gray-700 dark:text-gray-300" />
              </div>

              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Email Verified Successfully
              </h1>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your email has been verified. You can now continue.
              </p>

           
    {/* ⏱️ Countdown text */}
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Redirecting to onboarding in {redirectTime}s...
    </p>
            </>
          )}

         {/* ❌ Error */}
{isError && (
  <>
    <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
      <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
    </div>

    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
      Verification Failed
    </h1>

    <p className="text-sm text-gray-600 dark:text-gray-400">
      The verification link is invalid or has expired.
    </p>

    <div className="flex w-full gap-3">
      <Button
        onClick={() => navigate("/resend-verification-url")}
        className="w-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900"
      >
        Resend Link
      </Button>

    </div>
  </>
)}
       

        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyEmailPage
