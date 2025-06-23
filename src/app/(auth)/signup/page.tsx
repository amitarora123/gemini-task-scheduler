"use client";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/client";
import { toast } from "sonner";
import FormItem from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { googleLogin, signUp } from "@/app/actions/auth.action";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Invalid Email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const SignUp = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const { email, password } = data;
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const response = await signUp({ email, id: createdUser.user.uid });
      toast.success(response.message);
    } catch (err: any) {
      console.log("Error while registering user: ", err);
      toast.error("Signup failed " + err.message);
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
            Sign Up to Mystery Message
          </h1>
          <p className="mb-4">
            Welcome back to continue your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormItem
              control={form.control}
              name="email"
              placeholder="email"
              type="text"
              label="Email"
            />
            <FormItem
              control={form.control}
              name="password"
              placeholder="password"
              type="password"
              label="Password"
            />

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
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
            Already have an account?
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
