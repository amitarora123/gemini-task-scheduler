import { isAuthenticated } from "@/actions/auth.action";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const isAuth = await isAuthenticated();

  if (isAuth) {
    redirect("/");
  } else {
    return <div className="auth-layout pattern">{children}</div>;
  }
};

export default AuthLayout;
