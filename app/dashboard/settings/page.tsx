"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from "firebase/auth";
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
  const auth = getAuth();

  // Data Reset State
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Password Reset State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordResetting, setIsPasswordResetting] = useState(false);

  // Account Name State
  const [accountName, setAccountName] = useState(user?.displayName || "");
  const [isNameUpdating, setIsNameUpdating] = useState(false);

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
        description: "failed to reset data. :( please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation("");
    }
  };

  // const handleAccountNameUpdate = async () => {
  //   if (!user || !auth.currentUser) {
  //     toast({
  //       title: "Error",
  //       description: "user not authenticated",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (!accountName.trim()) {
  //     toast({
  //       title: "Error",
  //       description: "account name cannot be empty",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsNameUpdating(true);

  //   try {
  //     // Update display name in Firebase Auth
  //     await updateProfile(auth.currentUser, { 
  //       displayName: accountName.trim() 
  //     });

  //     // Optional: Update display name in Firestore if you have a user document
  //     if (user.uid) {
  //       await updateDoc(doc(db, "users", user.uid), {
  //         displayName: accountName.trim()
  //       });
  //     }

  //     toast({
  //       title: "Success",
  //       description: "account name updated successfully :D",
  //       variant: "default",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: "failed to update account name. please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsNameUpdating(false);
  //   }
  // };

  const handlePasswordReset = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "Error",
        description: "please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "new passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "new password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!user || !auth.currentUser) {
      toast({
        title: "Error",
        description: "user not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordResetting(true);

    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(
        user.email || '', 
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);

      // Reset form and show success toast
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      toast({
        title: "Success",
        description: "password updated successfully :D",
        variant: "default",
      });
    } catch (error: any) {
      let errorMessage = "failed to update password. please try again.";
      
      // More specific error handling
      if (error.code === 'auth/wrong-password') {
        errorMessage = "current password is incorrect";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "password is too weak. please choose a stronger password.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPasswordResetting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">settings</h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>account information</CardTitle>
          <CardDescription>your account details and preferences</CardDescription>
        </CardHeader>
        {/* <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">email</label>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">account name</label>
              <div className="flex space-x-2">
                <Input 
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="enter account name"
                />
                <Button 
                  onClick={handleAccountNameUpdate}
                  disabled={isNameUpdating}
                >
                  {isNameUpdating ? "updating..." : "update"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent> */}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>change password</CardTitle>
          <CardDescription>update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">current password</label>
            <Input 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="enter current password"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">new password</label>
            <Input 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="enter new password"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">confirm new password</label>
            <Input 
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="confirm new password"
            />
          </div>
          <Button 
            onClick={handlePasswordReset}
            disabled={isPasswordResetting}
            className="w-full"
          >
            {isPasswordResetting ? "updating password..." : "update password"}
          </Button>
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