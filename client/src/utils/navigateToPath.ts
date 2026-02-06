import { useNavigate } from "react-router-dom";

  const navigate = useNavigate();
  
export const navigateToPath = (path: string) => {

  return () => navigate(path);
};
