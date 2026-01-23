"use client";

import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";

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
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchQuery);
    }
  };

  const containerClass = isMobile
    ? "relative flex items-center border border-border-color rounded px-2 py-1 bg-white mb-4"
    : "relative flex items-center border border-border-color rounded px-2 py-1 bg-white";

  const inputClass = isMobile
    ? "outline-none border-none bg-transparent text-foreground placeholder:text-text-muted text-base w-full"
    : "outline-none border-none bg-transparent text-foreground placeholder:text-text-black text-sm w-24 focus:w-40 transition-all duration-300";

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
        <Search className="text-green-700 ml-2 w-4 h-4" />
      </button>

      {/* Search Results Pop-up */}
      {showSearchPopup && (
        <div
          ref={popupRef}
          className={`absolute top-full left-0 mt-2 w-full min-w-[200px] max-h-60 overflow-y-auto bg-white border border-border-color rounded-md shadow-lg z-50 py-1 ${
            isMobile ? "" : ""
          }`}
        >
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  onClick={(e) => {
                    e.preventDefault();
                    onResultClick(result.url);
                  }}
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition-colors duration-150"
                >
                  <span className="font-medium">{result.title}</span>{" "}
                  <span className="text-gray-500 text-xs">
                    ({result.category})
                  </span>
                </Link>
              ))}
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={closePopup}
                className="w-full text-right px-4 py-2 text-xs text-blue-600 hover:underline"
              >
                Close
              </button>
            </>
          ) : (
            searchQuery.trim() !== "" && (
              <div className="py-3 px-4 text-sm text-text-secondary">
                No results found for &quot;{searchQuery}&quot;.
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={closePopup}
                  className="w-full text-right px-4 py-2 text-xs text-blue-600 hover:underline"
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
