"use client";
import {
  LayoutDashboard,
  BaggageClaim,
  Wallet,
  Package,
  Settings,
  HelpCircle,
  LogOut,
  Gavel,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const menuItems = [
  { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { label: "Products", url: "/dashboard/products", icon: Package },
  { label: "Bid", url: "/dashboard/bid", icon: Gavel }, // Add this line

  { label: "Orders", url: "/dashboard/orders", icon: BaggageClaim },
  { label: "Wallet", url: "/dashboard/wallet", icon: Wallet },
  { label: "Settings", url: "/dashboard/settings", icon: Settings },
];

// const supportItems = [
//   { label: "Support", url: "/dashboard/support", icon: HelpCircle },
//   { label: "Log out", url: "/settings", icon: LogOut },
// ];

const Sidebar: React.FC = () => (
  <aside className="fixed flex flex-col h-screen w-[220px] bg-card-bg text-text-secondary p-8 shadow-[2px_0_8px_rgba(0,0,0,0.05)] z-100 justify-between border-r border-border-color">
    <div>
      <div className="flex justify-center items-center mb-10">
        <Link href="/">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            alt="SwapConnect Logo"
            className="h-10 w-auto"
          />
        </Link>
      </div>{" "}
      <nav>
        <ul className="list-none">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.url}
                className="flex items-center cursor-pointer py-3 px-8 text-[17px] transition-colors duration-200 hover:text-brand-primary"
              >
                <span className="mr-[16px] text-[20px]">
                  <item.icon size={20} />
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
    <nav>
      <ul className="list-none">
        <li>
          <Link
            href="/dashboard/support"
            className="flex items-center cursor-pointer py-3 text-[17px] transition-colors duration-200 hover:text-brand-primary"
          >
            <span className="text-[20px] mr-[16px]">
              <HelpCircle size={20} />
            </span>
            Support
          </Link>
        </li>
        <li>
          <button
            className="flex items-center w-full cursor-pointer py-3 text-[17px] transition-colors duration-200 hover:text-brand-primary bg-transparent border-none outline-none"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.replace("/login");
            }}
          >
            <span className="text-[20px] mr-[16px]">
              <LogOut size={20} />
            </span>
            Log out
          </button>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
