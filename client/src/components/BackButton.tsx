import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";


const BackButton = () => {
    const navigate = useNavigate();
  return (
        <button
          onClick={() => navigate(-1)}
          className="sm:hidden flex  gap-1 items-center text-sm font-medium"
        >
          <ChevronLeft size={18} />
          Back
        </button>
  )
}

export default BackButton
