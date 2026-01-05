import { useNavigate } from "react-router-dom";

import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

const NoUserFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Icon */}
      <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2 text-foreground">
        User Not Found
      </h1>

      {/* Description */}
      <p className="text-muted-foreground mb-6">
        The user you are looking for does not exist or has been removed.
      </p>

      {/* Back Home Button */}
      <Button
        onClick={() => navigate("/")}
        variant="default"
        size={"lg"}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default NoUserFound;
