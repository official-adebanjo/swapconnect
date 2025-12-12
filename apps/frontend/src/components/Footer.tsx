"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

const socialLinks = [
  { icon: "fab fa-twitter", href: "#" },
  { icon: "fab fa-whatsapp", href: "#" },
  { icon: "fab fa-facebook-f", href: "#" },
  { icon: "fab fa-linkedin-in", href: "#" },
  { icon: "fab fa-instagram", href: "#" },
  { icon: "fab fa-threads", href: "#" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/swap", label: "Swap" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
];

const categories = [
  { href: "/category/ios", label: "iOS" },
  { href: "/category/bluetooth", label: "Bluetooths" },
  { href: "/category/watches", label: "Watches" },
  { href: "/category/accessories", label: "Accessories" },
  { href: "/category/androids", label: "Androids" },
  { href: "/category/laptops", label: "Laptops" },
];

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
    <footer className="bg-gray- mt-8 pt-8 flex-shrink-0">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* First Column */}
          <div className="mb-6 md:mb-0 md:w-1/4">
            <Image
              src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1719573357/SwapConnect/logo-full_dhcmrc.png"
              alt="Logo"
              width={150}
              height={40}
              className="mb-4"
              onClick={handleClick}
            />
            <p className="text-gray-600 text-sm mb-4">
              SwapConnect is your trusted platform for swapping, buying, and
              selling quality tech devices and accessories. Enjoy seamless
              transactions, verified products, and unbeatable deals—all in one
              place.
            </p>
            <div className="flex gap-3 mt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.icon}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i
                    className={`${item.icon} text-xl text-black hover:text-green-700 transition-colors`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links & Categories: Side-by-side on small screens and up */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <div className="flex flex-row gap-6">
              {/* Quick Links */}
              <div className="w-full sm:w-1/2">
                <h5 className="font-bold text-lg mb-4">Quick links</h5>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-black hover:text-yellow-600 transition-colors text-base"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Categories */}
              <div className="w-full sm:w-1/2">
                <h5 className="font-bold text-lg mb-4">Categories</h5>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.href}>
                      <Link
                        href={cat.href}
                        className="text-black hover:text-green-700 transition-colors text-base"
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
            <h5 className="font-bold text-lg mb-4">
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
                  className="bg-gray-300 rounded-l-full px-4 py-2 flex-1 outline-none border-none"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-green-700 text-white px-4 py-2 rounded-r-full font-semibold hover:bg-green-800 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Copyright section */}
      <div className="bg-green-900 text-white mt-8">
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
