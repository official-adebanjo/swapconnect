"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { SOCIAL_LINKS, QUICK_LINKS, CATEGORIES, ASSETS } from "@/lib/constants";
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  whatsapp: FaWhatsapp,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  email: Mail,
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const getCurrentYear = () => new Date().getFullYear();

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <footer className={cn("bg-card mt-8 pt-8 shrink-0 border-t border-border")}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* First Column */}
          <div className="mb-6 md:mb-0 md:w-1/4">
            <Image
              src={ASSETS.LOGO}
              alt="Logo"
              width={150}
              height={40}
              className="mb-4 cursor-pointer"
              onClick={handleClick}
            />
            <p className="text-text-secondary text-sm mb-4">
              SwapConnect is your trusted platform for swapping, buying, and
              selling quality tech devices and accessories. Enjoy seamless
              transactions, verified products, and unbeatable deals—all in one
              place.
            </p>
            <div className="flex gap-3 mt-2">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="text-xl text-foreground hover:text-brand-primary transition-colors"
                >
                  {(() => {
                    const Icon = iconMap[item.id];
                    return Icon ? <Icon size={24} /> : null;
                  })()}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links & Categories: Side-by-side on small screens and up */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <div className="flex flex-row gap-6">
              {/* Quick Links */}
              <div className="w-full sm:w-1/2">
                <h5 className="font-bold text-lg mb-4 text-foreground">
                  Quick links
                </h5>
                <ul className="space-y-2">
                  {QUICK_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-foreground hover:text-brand-primary transition-colors text-base"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Categories */}
              <div className="w-full sm:w-1/2">
                <h5 className="font-bold text-lg mb-4 text-foreground">
                  Categories
                </h5>
                <ul className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.href}>
                      <Link
                        href={cat.href}
                        className="text-foreground hover:text-brand-primary transition-colors text-base"
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Fourth Column: Newsletter */}
          <div className="md:w-1/3">
            <h5 className="font-bold text-lg mb-4 text-foreground">
              Sign Up to Our Newsletter to Get Updates
            </h5>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) {
                  toast.error("Please enter a valid email address.");
                  return;
                }
                toast.success("Subscribed successfully! 🎉");
                setEmail("");
                // You can add API call here to actually subscribe the user
              }}
            >
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-muted text-foreground placeholder:text-text-muted rounded-l-full px-4 py-2 flex-1 outline-none border-none"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-brand-primary text-white px-4 py-2 rounded-r-full font-semibold hover:bg-brand-primary-hover transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Copyright section */}
      <div className="bg-brand-primary text-white mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-3 text-sm">
            &copy; {getCurrentYear()} All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
