"use client";

import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  title: string;
  category: string;
  url: string;
}

interface SearchOverlayProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchItem[];
  showSearchPopup: boolean;
  onSearch: (query: string) => void;
  onResultClick: (url: string) => void;
  closePopup: () => void;
  popupRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isMobile?: boolean;
  isLoading?: boolean;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  showSearchPopup,
  onSearch,
  onResultClick,
  closePopup,
  popupRef,
  inputRef,
  isMobile = false,
  isLoading = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchQuery);
    }
  };

  const containerClass = cn(
    "relative flex items-center border border-border rounded px-2 py-1 bg-white",
    isMobile ? "mb-4" : "",
  );

  const inputClass = cn(
    "outline-none border-none bg-transparent text-foreground placeholder:text-text-muted",
    isMobile
      ? "text-base w-full"
      : "text-sm w-24 focus:w-40 transition-all duration-300",
  );

  return (
    <div className={containerClass}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className={inputClass}
      />
      <button onClick={() => onSearch(searchQuery)} aria-label="Perform search">
        <Search className="text-brand-primary ml-2 w-4 h-4" />
      </button>

      {/* Search Results Pop-up */}
      {showSearchPopup && (
        <div
          ref={popupRef}
          className={cn(
            "absolute top-full left-0 mt-2 w-full min-w-[200px] max-h-60 overflow-y-auto bg-card border border-border rounded-md shadow-lg z-50 py-1",
          )}
        >
          {isLoading ? (
            <div className="p-2 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  onClick={(e) => {
                    e.preventDefault();
                    onResultClick(result.url);
                  }}
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-muted transition-colors duration-150"
                >
                  <span className="font-medium text-foreground">
                    {result.title}
                  </span>{" "}
                  <span className="text-text-secondary text-xs">
                    ({result.category})
                  </span>
                </Link>
              ))}
              <div className="border-t border-border my-1"></div>
              <button
                onClick={closePopup}
                className="w-full text-right px-4 py-2 text-xs text-brand-primary hover:underline"
              >
                Close
              </button>
            </>
          ) : (
            searchQuery.trim() !== "" && (
              <div className="py-3 px-4 text-sm text-text-secondary">
                No results found for &quot;{searchQuery}&quot;.
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={closePopup}
                  className="w-full text-right px-4 py-2 text-xs text-brand-primary hover:underline"
                >
                  Close
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchOverlay;
