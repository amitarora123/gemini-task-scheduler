"use client";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { auth, provider } from "@/firebase/client";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { googleLogin, signIn } from "@/app/actions/auth.action";

const formSchema = z.object({
  email: z.string().email("Invalid Email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default function AuthPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleLogin = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const { email, password } = data;
      const loggedInUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await loggedInUser.user.getIdToken(true);

      const response = await signIn({
        email,
        idToken,
      });

      toast.success(response.message);
      router.replace("/");
    } catch (err: any) {
      toast.error("error " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await googleLogin({
        idToken,
        params: {
          email: result.user.email!,
          id: result.user.uid!,
        },
      });
      if (response.success) {
        toast.success(response.message);
        router.replace("/");
      } else {
        console.log(response);
        toast.error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-3xl mb-6">
            Sign In to Mystery Message
          </h1>
          <p className="mb-4">
            Welcome back to continue your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <Button
          onClick={() => handleGoogleLogin()}
          className="w-full text-center my-3 rounded-full"
          variant="outline"
        >
          <FcGoogle size={24} /> Continue with Google
        </Button>
        <div className="text-center mt-4">
          <p>
            Don&apos;t have an Account?
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
