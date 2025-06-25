"use client";

import Link from "next/link";
import Image from "next/image";
import { logout } from "@/actions/auth.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Nav = () => {
  const router = useRouter();
  const performSignOut = async () => {
    try {
      const response = await logout();
      if (response.success) {
        toast.success(response.message);
        router.replace("/signin");
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Schedulify</p>
      </Link>
      <div className="flex ">
        <div className="flex gap-3 md:gap-5">
          <Link href="/dashboard" className="black_btn">
            Saved Tasks
          </Link>

          <button
            type="button"
            onClick={() => performSignOut()}
            className="outline_btn"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
