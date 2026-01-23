"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ShoppingCart, Search } from "lucide-react";

// Constants & Mock Data
import { ASSETS, NAV_LINKS } from "@/lib/constants";
import { MOCK_SEARCH_ITEMS } from "@/lib/mock-data";

// Stores & Utilities
import { useUserStore } from "@/stores/AuthStore";
import useCartStore from "@/stores/CartStore";
import useNavbarStore from "@/stores/NavbarStore";
import { getValidAvatarUrl } from "@/utils/user";

// Sub-components
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import NavLink from "./navbar/NavLink";
import UserDropdown from "./navbar/UserDropdown";
import SearchOverlay from "./navbar/SearchOverlay";
import MobileMenu from "./navbar/MobileMenu";

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
  const [searchResults, setSearchResults] = useState(MOCK_SEARCH_ITEMS);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const searchPopupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleToggle = () => setExpanded(!expanded);

  const handleSelect = useCallback(() => {
    setExpanded(false);
    setIsUserDropdownOpen(false);
    setShowSearchPopup(false);
  }, [setExpanded]);

  const handleLogout = useCallback(() => {
    logoutUser();
    router.push("/login");
    handleSelect();
  }, [logoutUser, router, handleSelect]);

  // --- Search Handlers ---
  const performSearch = useCallback((query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchPopup(false);
      return;
    }
    const filteredResults = MOCK_SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()),
    );
    setSearchResults(filteredResults);
    setShowSearchPopup(true);
  }, []);

  const handleSearchResultClick = useCallback(
    (url: string) => {
      router.push(url);
      setShowSearchPopup(false);
      setSearchQuery("");
      setExpanded(false);
    },
    [router, setExpanded],
  );

  const closeSearchPopup = useCallback(() => {
    setShowSearchPopup(false);
    setSearchQuery("");
  }, []);

  // Close dropdowns on outside click
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSearchPopup]);

  const userImageSrc = getValidAvatarUrl(user?.photoURL || user?.avatar);

  const searchProps = {
    searchQuery,
    setSearchQuery,
    searchResults,
    showSearchPopup,
    onSearch: performSearch,
    onResultClick: handleSearchResultClick,
    closePopup: closeSearchPopup,
    popupRef: searchPopupRef,
    inputRef: searchInputRef,
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="container max-w-6xl mx-auto flex items-center justify-between py-2 px-4 h-[60px]">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" onClick={handleSelect} className="flex items-center">
              <Image
                src={ASSETS.LOGO}
                alt="Logo"
                className="object-contain"
                width={100}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex space-x-6 items-center">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    label={link.label}
                    onClick={handleSelect}
                  />
                </li>
              ))}
              {!isLoggedIn && (
                <li>
                  <NavLink href="/login" label="Login" onClick={handleSelect} />
                </li>
              )}
            </ul>
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <Link href="/cart" className="relative p-1">
              <ShoppingCart className="text-green-700 w-5 h-5" />
              {carts?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {carts.length}
                </span>
              )}
            </Link>

            <button className="p-1" aria-label="Notifications">
              <Bell className="text-green-700 w-5 h-5" />
            </button>

            <SearchOverlay {...searchProps} />

            <ThemeToggle />

            <UserDropdown
              user={user}
              userImageSrc={userImageSrc}
              isOpen={isUserDropdownOpen}
              setIsOpen={setIsUserDropdownOpen}
              onLogout={handleLogout}
              dropdownRef={userDropdownRef}
            />
          </div>

          {/* Mobile Cart & Toggle */}
          <div className="flex items-center lg:hidden">
            <Link href="/cart" className="relative mr-2 p-1">
              <ShoppingCart className="text-green-700 w-5 h-5" />
              {carts?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {carts.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-1 mr-2"
              aria-label="Toggle search"
            >
              <Search className="text-green-700 w-5 h-5" />
            </button>

            {isLoggedIn && (
              <Link
                href="/dashboard"
                onClick={handleSelect}
                className="rounded-full overflow-hidden w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-green-700 transition-all duration-200 mr-2"
              >
                <Image
                  src={userImageSrc}
                  alt="User"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </Link>
            )}

            <button
              className="p-0 ml-2"
              aria-label={expanded ? "Close menu" : "Open menu"}
              onClick={handleToggle}
            >
              <Image
                src={expanded ? ASSETS.CANCEL_ICON : ASSETS.MENU_ICON}
                alt="Toggle Menu"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div
        className={`h-[60px] ${!expanded && isMobileSearchOpen ? "h-[110px]" : ""} lg:h-[60px] transition-all`}
      ></div>

      {/* Mobile Search Bar (when menu is closed but search is open) */}
      {!expanded && isMobileSearchOpen && (
        <div className="lg:hidden fixed top-[60px] left-0 w-full bg-white shadow-sm z-40 px-4 py-2">
          <SearchOverlay {...searchProps} isMobile={true} />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={expanded}
        isLoggedIn={isLoggedIn}
        onClose={handleSelect}
        onLogout={handleLogout}
        searchProps={searchProps}
      />
    </>
  );
};

export default Navbar;
