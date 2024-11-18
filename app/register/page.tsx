"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  condition: z.enum(["diabetes", "hypertension", "copd", "ckd", "chf"], {
    required_error: "Please select a condition",
  }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      condition: undefined,
    },
  });

  // Common user creation logic extracted to a separate function
  async function createUserProfile(user: any, additionalData: any = {}) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // Prepare user data with fallback values
    const userData: any = {
      name: additionalData.name || user.displayName || '',
      email: user.email,
      createdAt: new Date().toISOString(),
    };

    // Only add condition if it's a valid value
    if (additionalData.condition && 
        ["diabetes", "hypertension", "copd", "ckd", "chf"].includes(additionalData.condition)) {
      userData.condition = additionalData.condition;
    }

    // Only create profile if it doesn't already exist
    if (!userSnap.exists()) {
      await setDoc(userRef, userData);
    }

    return userRef;
  }

  async function onSocialSignUp(provider: 'google' | 'github') {
    setLoading(true);
    try {
      const authProvider = provider === 'google' 
        ? new GoogleAuthProvider() 
        : new GithubAuthProvider();

      const userCredential = await signInWithPopup(auth, authProvider);
      
      // Attempt to get condition from form if filled
      const condition = form.getValues('condition');

      await createUserProfile(userCredential.user, { condition });

      toast({
        title: "✅ Success",
        description: `Signed up with ${provider} successfully!`,
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

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      await createUserProfile(userCredential.user, values);

      toast({
        title: "✅ Success",
        description: "Account created successfully! Welcome aboard.",
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
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up to start managing your health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={() => onSocialSignUp('google')}
              disabled={loading}
            >
              Sign up with Google
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={() => onSocialSignUp('github')}
              disabled={loading}
            >
              Sign up with GitHub
            </Button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chronic Condition</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="hypertension">Hypertension</SelectItem>
                        <SelectItem value="copd">COPD</SelectItem>
                        <SelectItem value="ckd">Chronic Kidney Disease</SelectItem>
                        <SelectItem value="chf">
                          Congestive Heart Failure
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in here
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