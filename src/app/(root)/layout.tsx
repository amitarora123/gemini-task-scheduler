import Navbar from "@/components/Navbar";
import { isAuthenticated } from "../../actions/auth.action";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect("/signin");
  }
  return (
    <div className="pattern auth-layout px-10">
      <Navbar />
      <div className="mt-[10vh] " />
      {children}
    </div>
  );
};

export default layout;
