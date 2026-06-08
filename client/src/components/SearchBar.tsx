import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  debounceTime?: number;
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar = ({
  placeholder = "Search",
  debounceTime = 300,
  onSearch,
  className = "",
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [query, debounceTime, onSearch]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div
      ref={wrapperRef}
      className={`bg-input rounded-full ${className}`}
    >
      <div
        className="flex items-center w-full px-4 py-2 cursor-text"
        onClick={() => {
          setIsFocused(true);
          inputRef.current?.focus();
        }}
      >
        {!isFocused && (
          <Search size={18} className="text-muted-foreground mr-2" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {isFocused && query && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <X
            size={18}
            className="text-muted-foreground hover:text-foreground transition"
          />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
