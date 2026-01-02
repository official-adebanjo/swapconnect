"use client";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Menu,
  LayoutDashboard,
  BaggageClaim,
  Wallet,
  Package,
  Settings,
  HelpCircle,
  Gavel,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "../../lib/config";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useUserStore } from "@/stores/AuthStore";
import NotificationBell from "@/components/ui/notification-bell";
import ThemeToggle from "@/components/ui/ThemeToggle";

const menuItems = [
  { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { label: "Products", url: "/dashboard/products", icon: Package },
  { label: "Orders", url: "/dashboard/orders", icon: BaggageClaim },
  { label: "Bids", url: "/dashboard/bid", icon: Gavel },
  { label: "Wallet", url: "/dashboard/wallet", icon: Wallet },
  { label: "Support", url: "/dashboard/support", icon: HelpCircle },
  { label: "Settings", url: "/dashboard/settings", icon: Settings },
];

interface NavProps {
  title: string;
}

const DEFAULT_USER_ICON = "/images/user-icon.webp";

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

const Navbar: React.FC<NavProps> = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [userError, setUserError] = useState<string | null>(null); // Assigned but never used
  const [userLoading, setUserLoading] = useState(true);

  const token = useAuthToken(); // Custom auth token hook

  const { user, loginUser, logoutUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        logoutUser();
        setUserLoading(false);
        return;
      }
      setUserLoading(true);
      // setUserError(null); // Assigned but never used

      try {
        const response = await fetch(`${API_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("authToken");
            logoutUser();
            const currentUrl = window.location.href;
            window.location.href = `http://localhost:3000/auth/login?redirect=${encodeURIComponent(
              currentUrl
            )}`;
            return;
          }
          logoutUser();
          setUserLoading(false);
          return;
        }

        const data = await response.json();
        // console.log("User data:", data);

        if (data.data && typeof data.data === "object") {
          const sanitizedAvatar = getValidAvatarUrl(data.data.avatar);

          loginUser(
            {
              ...data.data,
              name: `${data.data.firstName} ${data.data.lastName}`,
              displayName: `${data.data.firstName} ${data.data.lastName}`,
              photoURL: sanitizedAvatar,
              avatar: sanitizedAvatar,
              email: data.data.email || "",
            },
            token
          );
        } else {
          logoutUser();
        }
      } catch {
        logoutUser();
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();

    // Token change listener (cross-tab sync)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "authToken") {
        fetchUser();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [token, loginUser, logoutUser]);

  const displayAvatarUrl = getValidAvatarUrl(user?.avatar || user?.photoURL);

  return (
    <nav className="fixed top-0 right-0 left-0 h-[85px] bg-card-bg border-b border-border-color flex items-center justify-between md:left-[220px] px-4 md:px-8 z-[101]">
      <div className="hidden md:flex items-center justify-between w-full">
        <h2 className="text-[24px] font-bold text-text-primary">{title}</h2>
        <div className="flex items-center gap-[32px]">
          <ThemeToggle />
          <div className="h-8 w-px bg-border-color" />
          <div className="flex cursor-pointer" aria-label="Notifications">
            <NotificationBell />
          </div>
          <div className="h-8 w-px bg-border-color" />
          <div className="flex items-center gap-[12px]">
            <span className="font-normal text-text-primary text-[16px]">
              {userLoading
                ? "Loading..."
                : typeof user?.name === "string" && user?.name.trim() !== ""
                ? user.name
                : "Guest"}
            </span>
            <Image
              src={displayAvatarUrl || "/placeholder.svg"}
              alt="Profile"
              width={40}
              height={40}
              className="w-[40px] h-[40px] rounded-full object-cover border-2 border-[#eee]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== DEFAULT_USER_ICON) {
                  target.src = DEFAULT_USER_ICON;
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between w-full">
        <div className="flex items-center gap-1 md:gap-3">
          <Image
            src={displayAvatarUrl || "/placeholder.svg"}
            alt="Profile"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-[#eee]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== DEFAULT_USER_ICON) {
                target.src = DEFAULT_USER_ICON;
              }
            }}
          />
          <span className="font-normal text-text-primary text-[16px]">
            {userLoading
              ? "Loading..."
              : typeof user?.name === "string" && user?.name.trim() !== ""
              ? user.name
              : "Guest"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex cursor-pointer" aria-label="Notifications">
            <NotificationBell />
          </div>
          <button
            className="flex cursor-pointer"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={28} className="text-text-primary" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex md:hidden">
          <div className="bg-white dark:bg-card-bg w-64 h-full shadow-lg p-6 flex flex-col justify-between">
            <div>
              <button
                className="mb-4 text-[#037F44] font-bold"
                onClick={() => setMenuOpen(false)}
              >
                Close
              </button>
              <ul className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 text-text-primary text-[16px] font-medium hover:text-brand-primary transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="mt-8 w-full py-2 bg-[#F87171] text-white rounded font-semibold hover:bg-[#d32f2f] transition"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/auth/login";
              }}
            >
              Logout
            </button>
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
