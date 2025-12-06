    import React, { useEffect, useRef, useState } from "react";
    import { gsap } from "gsap";
    import { Search, X } from "lucide-react";

    interface SearchPanelProps {
    isSearchPanelOpen: boolean;
    onClose: () => void;
    }

    const SearchPanel = ({ isSearchPanelOpen, onClose }: SearchPanelProps) => {
      const panelRef = useRef<HTMLDivElement>(null);
      const wrapperRef = useRef<HTMLDivElement>(null);
      const [query, setQuery] = useState<string>("");
      const [isClicked, setIsClicked] = useState<boolean>(false);
      const inputRef = useRef<HTMLInputElement>(null);
      const handleClear = () => {
        setIsClicked(false);
        setQuery("");
      };
      // Close when clicking outside
      useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (
            panelRef.current &&
            !panelRef.current.contains(e.target as Node)
          ) {
            onClose();
          }
        };

        if (isSearchPanelOpen) {
          document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }, [isSearchPanelOpen, onClose]);

      // Close when clicking outside
      useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (
            wrapperRef.current &&
            !wrapperRef.current.contains(e.target as Node)
          ) {
            setIsClicked(false);
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      // GSAP animation (left → right scale)
      useEffect(() => {
        if (!panelRef.current) return;

        gsap.set(panelRef.current, { transformOrigin: "left center" });

        if (isSearchPanelOpen) {
          gsap.to(panelRef.current, {
            scaleX: 1,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
            pointerEvents: "auto",
          });
        } else {
          gsap.to(panelRef.current, {
            scaleX: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power3.in",
            pointerEvents: "none",
          });
        }
      }, [isSearchPanelOpen]);

      return (
        <div
          ref={panelRef}
          className="fixed top-0 left-16 w-full max-w-sm min-h-screen bg-white shadow-lg z-50 py-3 px-6 opacity-0 pointer-events-none scale-x-0"
        >
          <h1 className="font-semibold text-2xl mt-4">Search</h1>

          {/* Search bar wrapper */}
          <div
            ref={wrapperRef}
            className="relative mt-4 bg-(--secondary) rounded-full"
          >
            <div
              className="flex items-center w-full px-4 py-2 "
              onClick={() => {
                setIsClicked(true);
                inputRef.current?.focus();
              }}
            >
              {/* Search Icon */}
              {!isClicked && (
                <Search size={18} className="text-gray-500 mr-2" />
              )}

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none text-sm"
                value={query}
                ref={inputRef}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Clear Button (X) */}
            {isClicked && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X size={18} className="text-gray-500 hover:text-gray-700" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {query && (
            <div className="mt-3 bg-gray-100 rounded-lg max-h-60 overflow-y-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-2 hover:bg-gray-200 cursor-pointer transition"
                >
                  {query} result {i}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    export default SearchPanel;
