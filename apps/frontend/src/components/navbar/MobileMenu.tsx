"use client";

import React from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";
import NavLink from "./NavLink";
import SearchOverlay from "./SearchOverlay";
import { NAV_LINKS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onLogout: () => void;
  searchProps: any; // Simplified for now
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isLoggedIn,
  onClose,
  onLogout,
  searchProps,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-95 z-40 flex flex-col pt-16 px-6 lg:hidden">
      <ul className="flex flex-col space-y-4 mb-6">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <NavLink
              href={link.href}
              label={link.label}
              onClick={onClose}
              className="nav-link text-lg font-medium block py-2 text-foreground"
            />
          </li>
        ))}
        {!isLoggedIn && (
          <li>
            <NavLink
              href="/login"
              label="Login"
              onClick={onClose}
              className="nav-link text-lg font-medium block py-2 text-foreground"
            />
          </li>
        )}
        {isLoggedIn && (
          <li>
            <Link
              href="/dashboard"
              className="nav-link text-lg font-medium py-2 text-foreground flex items-center"
              onClick={onClose}
            >
              <LayoutDashboard size={20} className="mr-2" />
              Dashboard
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <button
              onClick={onLogout}
              className="w-full text-left nav-link text-lg font-medium py-2 text-red-600 flex items-center"
            >
              <LogOut size={20} className="mr-2" /> Logout
            </button>
          </li>
        )}
      </ul>

      <SearchOverlay {...searchProps} isMobile={true} />
    </div>
  );
};

export default MobileMenu;
