
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFoundPage = () => {
    const navigate = useNavigate();

 return (
   <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
    
       <h1 className="text-[5rem] font-extrabold text-destructive mb-4">404</h1>
       <p className="text-lg text-muted-foreground mb-6">
         Oops! The page you are looking for does not exist.
       </p>
       <Button variant="default" size="lg" onClick={() => navigate("/")}>
         Back to Home
       </Button>
  
   </div>
 );
}
export default NotFoundPage;
