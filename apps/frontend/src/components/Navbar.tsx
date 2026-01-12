"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faShoppingCart,
  faSearch,
  faShoppingBag,
  faCog,
  faSignOutAlt,
  faTachometerAlt,
  // faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { create } from "zustand";
import { useRouter } from "next/navigation";

// Static assets as URLs
const logoFull = "/logo.png";
const menuIcon =
  "https://res.cloudinary.com/ds83mhjcm/image/upload/v1747647290/SwapConnect/menu-icon_hh6lo7.svg";
const cancelIcon =
  "https://res.cloudinary.com/ds83mhjcm/image/upload/v1747647290/SwapConnect/menu-cancel-icon_mzesfv.svg";

// Default user icon path (create this file in public/images/)
const DEFAULT_USER_ICON = "/images/user-icon.webp";

// Stores
import { useUserStore } from "@/stores/AuthStore";
import useCartStore from "../stores/CartStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Zustand store for navbar expanded state
interface NavbarStoreState {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
}
const useNavbarStore = create<NavbarStoreState>((set) => ({
  expanded: false,
  setExpanded: (expanded) => set({ expanded }),
  toggleExpanded: () => set((state) => ({ expanded: !state.expanded })),
}));

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/swap", label: "Swap" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
];

// --- Mock Data for Search ---
// In a real application, this would come from an API
const mockSearchableItems = [
  {
    id: "1",
    title: "Latest iPhone 15",
    category: "phone",
    url: "/shop/iphone-15",
  },
  {
    id: "2",
    title: "Samsung Galaxy S24 Ultra",
    category: "phone",
    url: "/shop/galaxy-s24-ultra",
  },
  {
    id: "3",
    title: "PlayStation 5 Console",
    category: "gaming",
    url: "/shop/ps5",
  },
  {
    id: "4",
    title: "Xbox Series X",
    category: "gaming",
    url: "/shop/xbox-series-x",
  },
  {
    id: "5",
    title: "MacBook Pro M3",
    category: "laptop",
    url: "/shop/macbook-pro-m3",
  },
  {
    id: "6",
    title: "Dell XPS 15",
    category: "laptop",
    url: "/shop/dell-xps-15",
  },
  { id: "7", title: "About SwapConnect", category: "page", url: "/about" },
  { id: "8", title: "How Swapping Works", category: "guide", url: "/swap" },
  {
    id: "9",
    title: "Gaming Headphones",
    category: "accessory",
    url: "/shop/gaming-headphones",
  },
];
// --- End Mock Data ---

const getValidAvatarUrl = (avatarUrl: string | null | undefined): string => {
  // Return default if no avatar or invalid avatar
  if (!avatarUrl || typeof avatarUrl !== "string" || avatarUrl.trim() === "") {
    return DEFAULT_USER_ICON;
  }

  // Check if it's a problematic external URL (vectorstock, etc.)
  if (
    avatarUrl.includes("vectorstock.com") ||
    avatarUrl.includes("placeholder")
  ) {
    return DEFAULT_USER_ICON;
  }

  // If it's a relative path, ensure it starts with /
  if (!avatarUrl.startsWith("http") && !avatarUrl.startsWith("/")) {
    return `/${avatarUrl}`;
  }

  return avatarUrl;
};

const Navbar: React.FC = () => {
  const { user, logoutUser } = useUserStore();
  const router = useRouter();
  const isLoggedIn = !!user;
  const { carts } = useCartStore();
  const { expanded, setExpanded } = useNavbarStore();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    typeof mockSearchableItems
  >([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const searchPopupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // Mobile search toggle state
  // --- End Search State ---

  const handleToggle = () => setExpanded(!expanded);
  const handleSelect = () => {
    setExpanded(false);
    setIsUserDropdownOpen(false);
    setShowSearchPopup(false); // Close search popup on nav item click
  };

  useEffect(() => {
    // Similar fetch logic as above, or just call checkAuth if you want to use the store's built-in method
    // useUserStore.getState().checkAuth();
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/auth/login");
  };

  // --- Search Handlers ---
  const performSearch = (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchPopup(false);
      return;
    }
    const filteredResults = mockSearchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredResults);
    setShowSearchPopup(true);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Optional: live search as user types
    performSearch(e.target.value);
  };

  const handleSearchClick = () => {
    performSearch(searchQuery);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch(searchQuery);
    }
  };

  const handleSearchResultClick = (url: string) => {
    router.push(url);
    setShowSearchPopup(false); // Close popup after navigating
    setSearchQuery(""); // Clear search query
  };

  const closeSearchPopup = () => {
    setShowSearchPopup(false);
    setSearchQuery(""); // Clear search query when closing popup
  };
  // --- End Search Handlers ---

  // Close user dropdown or search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        searchPopupRef.current &&
        !searchPopupRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        closeSearchPopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine which user image to show
  const userImageSrc = getValidAvatarUrl(user?.photoURL || user?.avatar);

  return (
    <>
      <nav className=" fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="container max-w-6xl mx-auto flex items-center justify-between py-2 px-4">
          {/* Logo on the left */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" onClick={handleSelect} className="flex items-center">
              <Image
                src={logoFull || "/placeholder.svg"}
                alt="Logo"
                className="object-contain"
                width={100}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* Menu items in the center (desktop only) */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex space-x-6 items-center">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="nav-link text-black font-medium transition-colors duration-300 hover:text-yellow-600 hover:border-b-2 hover:border-yellow-600 py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {!isLoggedIn && (
                <li>
                  <Link
                    href="/auth/login"
                    className="nav-link text-black font-medium transition-colors duration-300 hover:text-yellow-600 hover:border-b-2 hover:border-yellow-600 py-1"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Right section with icons (desktop only) */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <Link href="/cart" className="relative p-1">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-green-700 w-5 h-5"
              />
              {carts?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {carts.length}
                </span>
              )}
            </Link>

            <button className="p-1" aria-label="Notifications">
              <FontAwesomeIcon
                icon={faBell}
                className="text-green-700 w-5 h-5"
              />
            </button>
            <div className="relative flex items-center border border-border-color rounded px-2 py-1 bg-white">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
                className="outline-none border-none bg-transparent text-foreground placeholder:text-text-black text-sm w-24 focus:w-40 transition-all duration-300" // Expand on focus
              />
              <button onClick={handleSearchClick} aria-label="Perform search">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-green-700 ml-2 w-4 h-4"
                />
              </button>

              {/* Search Results Pop-up (Desktop) */}
              {showSearchPopup && searchResults.length > 0 && (
                <div
                  ref={searchPopupRef}
                  className="absolute top-full left-0 mt-2 w-full min-w-[200px] max-h-60 overflow-y-auto bg-white border border-border-color rounded-md shadow-lg z-50 py-1"
                >
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      onClick={() => handleSearchResultClick(result.url)}
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
                    onClick={closeSearchPopup}
                    className="w-full text-right px-4 py-2 text-xs text-blue-600 hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}
              {showSearchPopup &&
                searchResults.length === 0 &&
                searchQuery.trim() !== "" && (
                  <div
                    ref={searchPopupRef}
                    className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-border-color rounded-md shadow-lg z-50 py-3 px-4 text-sm text-text-secondary"
                  >
                    No results found for &quot;{searchQuery}&quot;.
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={closeSearchPopup}
                      className="w-full text-right px-4 py-2 text-xs text-blue-600 hover:underline"
                    >
                      Close
                    </button>
                  </div>
                )}
            </div>
            <ThemeToggle />

            {/* User Icon/Dropdown (Desktop) */}
            {isLoggedIn && (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="rounded-full overflow-hidden w-9 h-9 flex items-center justify-center border-2 border-transparent hover:border-green-700 transition-all duration-200"
                  aria-label="User menu"
                >
                  <Image
                    src={userImageSrc || "/placeholder.svg"}
                    alt={user?.displayName || "User"}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== DEFAULT_USER_ICON) {
                        target.src = DEFAULT_USER_ICON;
                      }
                    }}
                  />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <p className="block px-4 py-2 text-sm text-text-primary font-semibold truncate">
                      {user?.displayName || user?.email || "User"}
                    </p>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      href="/dashboard/orders"
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                      Orders
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FontAwesomeIcon
                        icon={faTachometerAlt}
                        className="mr-2"
                      />{" "}
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FontAwesomeIcon icon={faCog} className="mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />{" "}
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Cart & Hamburger */}
          <div className="flex items-center lg:hidden">
            <Link href="/cart" className="relative mr-2 p-1">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-green-700 w-5 h-5"
              />
              {carts?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {carts.length}
                </span>
              )}
            </Link>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-1 mr-2"
              aria-label="Toggle search"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="text-green-700 w-5 h-5"
              />
            </button>

            {isLoggedIn && (
              <button
                onClick={() => {
                  router.push("/profile");
                  handleSelect();
                }}
                className="rounded-full overflow-hidden w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-green-700 transition-all duration-200 mr-2"
                aria-label="User profile"
              >
                <Image
                  src={userImageSrc || "/placeholder.svg"}
                  alt={user?.displayName || "User"}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== DEFAULT_USER_ICON) {
                      target.src = DEFAULT_USER_ICON;
                    }
                  }}
                />
              </button>
            )}

            <button
              className="custom-toggler p-0 ml-2"
              aria-label={expanded ? "Close menu" : "Open menu"}
              onClick={handleToggle}
            >
              <Image
                src={expanded ? cancelIcon : menuIcon}
                alt={expanded ? "Close menu" : "Open menu"}
                width={24}
                height={24}
                className="menu-icon"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer div to prevent content from overlapping the fixed navbar */}
      {/* Navbar height is approx 60px. Mobile search bar is attached below it. */}
      {/* If mobile search bar is visible (lg:hidden and !expanded), we need more space. */}
      {/* Mobile search bar height is approx 50-60px. Total ~110-120px. */}
      <div
        className={`transition-all duration-300 ${
          !expanded ? "pt-[120px]" : "pt-[60px]"
        } lg:pt-[70px]`}
      ></div>

      {/* Mobile Menu Overlay */}
      {expanded && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-95 z-40 flex flex-col pt-16 px-6">
          <ul className="flex flex-col space-y-4 mb-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="nav-link text-lg font-medium block py-2 text-foreground"
                  onClick={handleSelect}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!isLoggedIn && (
              <li>
                <Link
                  href="/auth/login"
                  className="nav-link text-lg font-medium block py-2 text-foreground"
                  onClick={handleSelect}
                >
                  Login
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link
                  href="/dashboard"
                  className="nav-link text-lg font-medium block py-2 text-foreground"
                  onClick={handleSelect}
                >
                  <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />{" "}
                  Dashboard
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left nav-link text-lg font-medium block py-2 text-red-600"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />{" "}
                  Logout
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Search Bar inside expanded menu */}
          <div className="relative flex items-center border border-border-color rounded px-2 py-1 bg-white mb-4">
            <input
              ref={searchInputRef} // Attach ref for mobile search
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
              className="outline-none border-none bg-transparent text-foreground placeholder:text-text-muted text-base w-full"
            />
            <button onClick={handleSearchClick} aria-label="Perform search">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-green-700 ml-2"
              />
            </button>
            {/* Search Results Pop-up (Mobile) */}
            {showSearchPopup && searchResults.length > 0 && (
              <div
                ref={searchPopupRef}
                className="absolute top-full left-0 mt-2 w-full min-w-[200px] max-h-60 overflow-y-auto bg-white border border-border-color rounded-md shadow-lg z-50 py-1"
              >
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => handleSearchResultClick(result.url)}
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition-colors duration-150"
                  >
                    <span className="font-medium">{result.title}</span>{" "}
                    <span className="text-text-secondary text-xs">
                      ({result.category})
                    </span>
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={closeSearchPopup}
                  className="w-full text-right px-4 py-2 text-xs text-blue-600 hover:underline"
                >
                  Close
                </button>
              </div>
            )}
            {showSearchPopup &&
              searchResults.length === 0 &&
              searchQuery.trim() !== "" && (
                <div
                  ref={searchPopupRef}
                  className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-border-color rounded-md shadow-lg z-50 py-3 px-4 text-sm text-text-secondary"
                >
                  No results found for &quot;{searchQuery}&quot;.
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={closeSearchPopup}
                    className="w-full text-right px-4 py-2 text-xs text-blue-600 hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Mobile Search Bar (when menu is closed) */}
      {!expanded && isMobileSearchOpen && (
        <div className="lg:hidden fixed top-[60px] left-0 w-full bg-white shadow-sm z-40 px-4 py-2">
          <div className="relative flex items-center border border-border-color rounded px-2 py-1 bg-white">
            <input
              ref={searchInputRef} // Attach ref for mobile search (when menu is closed)
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
              className="outline-none border-none bg-transparent text-foreground placeholder:text-text-muted text-base w-full"
            />
            <button onClick={handleSearchClick} aria-label="Perform search">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-green-700 ml-2"
              />
            </button>
            {/* Search Results Pop-up (Mobile, when menu is closed) */}
            {showSearchPopup && searchResults.length > 0 && (
              <div
                ref={searchPopupRef}
                className="absolute top-full left-0 mt-2 w-full min-w-[200px] max-h-60 overflow-y-auto bg-white border border-border-color rounded-md shadow-lg z-50 py-1"
              >
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => handleSearchResultClick(result.url)}
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition-colors duration-150"
                  >
                    <span className="font-medium">{result.title}</span>{" "}
                    <span className="text-text-secondary text-xs">
                      ({result.category})
                    </span>
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={closeSearchPopup}
                  className="w-full text-right px-4 py-2 text-xs text-blue-600 hover:underline"
                >
                  Close
                </button>
              </div>
            )}
            {showSearchPopup &&
              searchResults.length === 0 &&
              searchQuery.trim() !== "" && (
                <div
                  ref={searchPopupRef}
                  className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-border-color rounded-md shadow-lg z-50 py-3 px-4 text-sm text-text-secondary"
                >
                  No results found for &quot;{searchQuery}&quot;.
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={closeSearchPopup}
                    className="w-full text-right px-4 py-2 text-xs text-blue-600 hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
