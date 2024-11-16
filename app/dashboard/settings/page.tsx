"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, getDocs, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResetData = async () => {
    if (!user || deleteConfirmation !== user.email) return;

    setIsDeleting(true);
    try {
      // WARNING: deletes all metrics 
      const metricsRef = collection(db, "users", user.uid, "metrics");
      const metricsSnapshot = await getDocs(metricsRef);
      const deletionPromises = metricsSnapshot.docs.map(async (document) => {
        await deleteDoc(doc(db, "users", user.uid, "metrics", document.id));
      });
      await Promise.all(deletionPromises);

      toast({
        title: "Success",
        description: "all data has been reset successfully :D",
        variant: "default",
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "failed to reset data. :( pleasee try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation("");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>account information</CardTitle>
          <CardDescription>your account details and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">email</label>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">! danger zone !</CardTitle>
          <CardDescription>
            irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">reset all data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>are you absolutely absolutely absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  this cannot be undonee! this will permanently delete all
                  your health metrics + settings.
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      please type your email to confirm deletion:
                    </p>
                    <Input
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder={user?.email || ""}
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetData}
                  disabled={deleteConfirmation !== user?.email || isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "deleting :( ..." : "reset all data"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}