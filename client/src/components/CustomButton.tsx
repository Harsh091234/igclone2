import React from "react";
import { Loader2 } from "lucide-react";

interface PrimaryButtonProps {
  loading?: boolean;
  text: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  loaderClasses?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<PrimaryButtonProps> = ({
  loading = false,
  text,
  className = "text-sm px-3 py-2",
  onClick,
  type = "button",
  loaderClasses = "h-4 w-4 ",
  disabled
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
    rounded-lg text-primary-foreground
    bg-primary hover:bg-primary/90
    transition flex items-center justify-center gap-2
    disabled:opacity-70 disabled:cursor-not-allowed
    ${className}
  `}
    >
      {loading ? (
        <Loader2 className={`${loaderClasses}  animate-spin`} />
      ) : (
        text
      )}
    </button>
  );
};

export default CustomButton;
