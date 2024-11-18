"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";  // avatar components
import { Button } from "@/components/ui/button";  // button component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";  // dropdown menu components
import { useAuth } from "@/components/auth-provider";  // auth context hook
import { signOut } from "firebase/auth";  // firebase sign-out function
import { auth } from "@/lib/firebase";  // firebase auth instance
import { useRouter } from "next/navigation";  // next.js router for navigation
import { useEffect } from "react";  // react hook for side effects

// user navigation component
export function UserNav() {
  const { user } = useAuth();  // get current user from auth context
  const router = useRouter();  // next.js router for navigation

  // handle user sign out
  const handleSignOut = async () => {
    await signOut(auth);  // sign out from firebase
  };

  useEffect(() => {
    // redirect user to homepage after logout
    if (!user) {
      router.replace("/");  // prevent history stack pollution
    }
  }, [user, router]);

  return (
    <DropdownMenu>
      {/* trigger button with user avatar */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || ""} alt={user?.email || ""} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || "U"}  
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* user profile details */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* settings link */}
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* log out option */}
        <DropdownMenuItem onClick={handleSignOut}>
          log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
