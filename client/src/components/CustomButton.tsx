import React from "react";
import { Loader2 } from "lucide-react";

interface PrimaryButtonProps {
  loading?: boolean;
  text: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

const CustomButton: React.FC<PrimaryButtonProps> = ({
  loading=false,
  text,
  className = "text-sm px-3 py-2",
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`
       rounded-lg text-white
        bg-(--primary) hover:bg-(--primary-hover)
        transition flex items-center justify-center gap-2
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : text}
      
    </button>
  );
};

export default CustomButton;
