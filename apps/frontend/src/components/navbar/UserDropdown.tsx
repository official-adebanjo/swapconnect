"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { AuthUser } from "@/stores/AuthStore";
import { DEFAULT_USER_ICON } from "@/utils/user";

interface UserDropdownProps {
  user: AuthUser | null;
  userImageSrc: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  userImageSrc,
  isOpen,
  setIsOpen,
  onLogout,
  dropdownRef,
}) => {
  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
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
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <p className="block px-4 py-2 text-sm text-text-primary font-semibold truncate">
            {user?.displayName || user?.email || "User"}
          </p>
          <div className="border-t border-gray-100 my-1"></div>
          <Link
            href="/dashboard/orders"
            className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag size={16} className="mr-2 inline-block" />
            Orders
          </Link>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard size={16} className="mr-2 inline-block" />{" "}
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} className="mr-2 inline-block" />
            Settings
          </Link>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} className="mr-2 inline-block" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
