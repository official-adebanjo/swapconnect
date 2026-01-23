"use client";

import React from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavLink from "./NavLink";
import SearchOverlay, { type SearchOverlayProps } from "./SearchOverlay";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onLogout: () => void;
  searchProps: Omit<SearchOverlayProps, "isMobile">;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isLoggedIn,
  onClose,
  onLogout,
  searchProps,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed inset-0 w-full h-full bg-background/98 backdrop-blur-md z-40 flex flex-col pt-20 px-6 lg:hidden",
          )}
        >
          <ul className="flex flex-col space-y-2 mb-8">
            {NAV_LINKS.map((link, index) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  href={link.href}
                  label={link.label}
                  onClick={onClose}
                  className="nav-link text-xl font-semibold block py-3 text-foreground hover:text-brand-primary transition-colors border-b border-border/50"
                />
              </motion.li>
            ))}
            {!isLoggedIn && (
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
              >
                <NavLink
                  href="/login"
                  label="Login"
                  onClick={onClose}
                  className="nav-link text-xl font-semibold block py-3 text-foreground hover:text-brand-primary transition-colors border-b border-border/50"
                />
              </motion.li>
            )}
            {isLoggedIn && (
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
              >
                <Link
                  href="/dashboard"
                  className="nav-link text-xl font-semibold py-4 text-foreground flex items-center hover:text-brand-primary transition-colors border-b border-border/50"
                  onClick={onClose}
                >
                  <LayoutDashboard
                    size={24}
                    className="mr-3 text-brand-primary"
                  />
                  Dashboard
                </Link>
              </motion.li>
            )}
            {isLoggedIn && (
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (NAV_LINKS.length + 1) * 0.05 }}
              >
                <button
                  onClick={onLogout}
                  className="w-full text-left nav-link text-xl font-semibold py-4 text-text-error flex items-center hover:bg-error-bg/50 px-2 rounded-lg transition-colors mt-2"
                >
                  <LogOut size={24} className="mr-3" /> Logout
                </button>
              </motion.li>
            )}
          </ul>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SearchOverlay {...searchProps} isMobile={true} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
