import Link from "next/link";
import AuthButton from "./AuthButton";
import type { HeaderMenuLink } from "./Header";

export const NavLinks: HeaderMenuLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Members",
    href: "/members",
    children: [
      {
        label: "List Members",
        href: "/members/all",
      },
      {
        label: "Add Member",
        href: "/members/new",
      },
    ],
  },
];

export const NavMenuLinks = () => {
  return (
    <>
      {NavLinks.map(({ label, href, icon, children }) => {
        if (children && children.length > 0) {
          return (
            <li key={href}>
              <details>
                <summary>
                  {icon}
                  <span>{label}</span>
                </summary>
                <ul className="p-2">
                  {children.map(({ label, href, icon }) => (
                    <li key={href}>
                      <Link href={href} passHref>
                        {icon}
                        <span>{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          );
        } else {
          return (
            <li key={href}>
              <Link href={href} passHref>
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          );
        }
      })}
    </>
  );
};

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <NavMenuLinks />
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">ChainChama</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <NavMenuLinks />
        </ul>
      </div>
      <div className="navbar-end">
        <AuthButton />
      </div>
    </div>
  );
};

export default Navbar;
