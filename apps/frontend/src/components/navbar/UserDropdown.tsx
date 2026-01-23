"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthUser } from "@/stores/AuthStore";
import { DEFAULT_USER_ICON } from "@/utils/user";
import { cn } from "@/lib/utils";

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
        className={cn(
          "rounded-full overflow-hidden w-9 h-9 flex items-center justify-center border-2 transition-all duration-200",
          isOpen
            ? "border-brand-primary"
            : "border-transparent hover:border-brand-primary/50",
        )}
        aria-label="User menu"
      >
        <Image
          src={userImageSrc || DEFAULT_USER_ICON}
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-2xl py-2 z-50 border border-border overflow-hidden"
          >
            <div className="px-4 py-3 bg-muted/30">
              <p className="text-sm font-bold text-foreground truncate">
                {user?.displayName || user?.firstName || "User"}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {user?.email}
              </p>
            </div>

            <div className="border-t border-border my-1"></div>

            <div className="px-1">
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-brand-primary/10 hover:text-brand-primary rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={18} className="mr-3" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-brand-primary/10 hover:text-brand-primary rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag size={18} className="mr-3" />
                Orders
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-brand-primary/10 hover:text-brand-primary rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} className="mr-3" />
                Settings
              </Link>
            </div>

            <div className="border-t border-border my-1"></div>

            <div className="px-1">
              <button
                onClick={onLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-text-error hover:bg-error-bg/50 rounded-md transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
