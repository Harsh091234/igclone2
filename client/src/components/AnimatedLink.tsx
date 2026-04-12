import { Link} from "react-router-dom";

interface AnimatedLinkProps{
  path: string;
  text: string;
  className?: string;
}

export default function AnimatedLink({
  path,
  text,
  className = "",

}: AnimatedLinkProps) {
  return (
    <Link
      to={path}
      className={`relative inline-block text-foreground
        after:content-[''] after:absolute after:h-[1.5px] after:w-full
        after:bg-foreground after:-bottom-0.5 after:right-0
        after:scale-x-0 after:origin-right
        after:transition-transform after:duration-300
        hover:after:scale-x-100 hover:after:origin-left
        ${className}`}
    
    >
      {text}
    </Link>
  );
}