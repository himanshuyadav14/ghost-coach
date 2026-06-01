"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { logout, isLoading } = useAuth();

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully");
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4" />
      Log out
    </Button>
  );
}
