import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "~~/lib/auth";

const AuthButton = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return session ? (
    <div className="dropdown dropdown-end flex items-center justify-center">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-12 rounded-full">
          <Image
            alt="Tailwind CSS Navbar component"
            src={session.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            width={240}
            height={240}
          />
        </div>
      </div>

      <div>{session?.user?.name}</div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <Link href="/api/auth/signout">Logout</Link>
        </li>
      </ul>
    </div>
  ) : (
    <>
      <Link href="/api/auth/signin">Login</Link>
    </>
  );
};

export default AuthButton;
