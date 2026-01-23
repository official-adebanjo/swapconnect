import Link from "next/link";
import React from "react";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
  activeClassName?: string;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  onClick,
  className = "nav-link text-foreground font-medium transition-colors duration-300 hover:text-yellow-600 hover:border-b-2 hover:border-yellow-600 py-1",
  activeClassName = "text-yellow-600 border-b-2 border-yellow-600",
  isActive,
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${className} ${isActive ? activeClassName : ""}`}
    >
      {label}
    </Link>
  );
};

export default NavLink;
