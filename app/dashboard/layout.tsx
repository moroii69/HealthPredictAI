"use client";

import { useAuth } from "@/components/auth-provider";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <DashboardNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
    </div>
  );
}