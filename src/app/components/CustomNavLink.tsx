// components/NavLink.tsx
"use client";

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';

interface NavLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ children, className, activeClassName, href, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only start NProgress if it's an actual navigation to a different path
    if (pathname !== href) {
      NProgress.start();
    }
    // Any other onClick logic can go here
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <Link
      href={href}
      className={`${className || ''} ${isActive && activeClassName ? activeClassName : ''}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
