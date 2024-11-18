"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Common error handling for social sign-ins
  const handleSocialSignInError = (error: any) => {
    let errorMessage = "Sign-in failed. Please try again.";
    
    if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = "An account already exists with a different sign-in method.";
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = "Sign-in popup was blocked. Please allow popups and try again.";
    }

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      toast({
        title: "✅ Success",
        description: "Signed in with Google successfully!",
        variant: "default",
      });

      router.push("/dashboard");
    } catch (error: any) {
      handleSocialSignInError(error);
    } finally {
      setLoading(false);
    }
  };

  // GitHub Sign-In Handler
  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);

      toast({
        title: "✅ Success",
        description: "Signed in with GitHub successfully!",
        variant: "default",
      });

      router.push("/dashboard");
    } catch (error: any) {
      handleSocialSignInError(error);
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);

      toast({
        title: "✅ Success",
        description: "Signed in successfully! Welcome back.",
        variant: "default",
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          {/* Social Sign-In Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              className="w-full"
            >
              Sign in with Google
            </Button>
            <Button 
              variant="outline" 
              onClick={handleGitHubSignIn} 
              disabled={loading}
              className="w-full"
            >
              Sign in with GitHub
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Go Back to Home Button outside the Card */}
      <div className="mt-4 text-center">
        <Button onClick={() => router.push("/")} className="w-full">
          Go back to Home
        </Button>
      </div>
    </div>
  );
}