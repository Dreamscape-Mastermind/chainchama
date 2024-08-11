"use client";

import React, { type SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";
import { RainbowKitCustomConnectButton } from "./scaffold-eth";

export type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: HeaderMenuLink[];
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  { label: "How it Works", href: "/" },
  { label: "Features", href: "/" },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            passHref
            className={`${isActive ? "" : ""} text-sm font-medium hover:underline underline-offset-4`}
            prefetch={false}
          >
            <span>{label}</span>
          </Link>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  return (
    <>
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-background">
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg font-bold">ChainChama</span>
          </Link>
        </div>
        <nav className="ml-auto flex items-center justify-center gap-4 sm:gap-6">
          <HeaderMenuLinks />
          {/* <AuthButton/> */}
          <RainbowKitCustomConnectButton />
          {/* <FaucetButton /> */}
          {/* <SuperchainFaucetButton /> */}
          {/* <DappConsoleButton /> */}

          <AuthButton />
        </nav>
      </header>
    </>
  );
};

function MountainIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
