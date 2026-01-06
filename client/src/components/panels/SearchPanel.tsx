import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Search, X } from "lucide-react";

import type { SearchUser } from "../../types/user.types";

import { useNavigate } from "react-router-dom";
import { useLazySearchUsersQuery } from "../../services/userApi";
import { SearchUsersSkeleton } from "../Skeletons/SearchUsersSkeleton";

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
  const [searchUser, { isLoading, data }] = useLazySearchUsersQuery();
  const users = data?.users ?? [];

  const navigate = useNavigate();

  const handleClear = () => {
    setIsClicked(false);
    setQuery("");
  };
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) return;
      if (query.trim()) searchUser(query);
    }, 300);

    return () => clearTimeout(timer); // debounce to not flood users
  }, [query]);

  const handleNavigate = (userName: string) => {
    onClose();
    navigate(`/profile/${userName}`);
  };

  return (
    <div
      ref={panelRef}
      className="
    fixed top-0 left-16 w-full max-w-sm min-h-screen
    bg-card
    shadow-lg z-50 py-3 px-6
    opacity-0 pointer-events-none scale-x-0 rounded-r-2xl border-r-2 border-r-border 
  "
    >
      <h1 className="font-semibold text-2xl mt-4 text-foreground">Search</h1>

      {/* Search bar wrapper */}
      <div ref={wrapperRef} className="relative mt-4 bg-input rounded-full">
        <div
          className="flex items-center w-full px-4 py-2 cursor-text"
          onClick={() => {
            setIsClicked(true);
            inputRef.current?.focus();
          }}
        >
          {/* Search Icon */}
          {!isClicked && (
            <Search size={18} className="text-muted-foreground mr-2" />
          )}

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            value={query}
            ref={inputRef}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Clear Button (X) */}
        {isClicked && (
          <button
            onClick={(e) => {
              handleClear();
              e.stopPropagation();
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

      {/* Search Results */}
      {query &&
        (isLoading ? (
          <div className="mt-5 w-full">
            <SearchUsersSkeleton />
          </div>
        ) : users.length > 0 ? (
          <div className="mt-5 rounded-lg max-h-60 overflow-y-auto">
            {users.map((user: SearchUser) => (
              <div
                key={user._id}
                onClick={(e) => handleNavigate(user.userName)}
                className="
              flex items-center gap-4 p-2 rounded-lg cursor-pointer
              hover:bg-accent
              transition
            "
              >
                <img
                  src={user.profilePic}
                  alt={user.userName}
                  className="w-10 h-10 rounded-full object-cover border border-border"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-foreground">
                    @{user.userName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {user.fullName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-sm text-muted-foreground pl-5">
            No users found.
          </div>
        ))}
    </div>
  );
};

export default SearchPanel;
