import Navbar from "@/components/Navbar";
import { isAuthenticated } from "../actions/auth.action";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect("/signin");
  }
  return (
    <div className="auth-layout pattern">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
