"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth.store";
import type { SessionUser } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, setUser, setLoading, reset } = useAuthStore();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<SessionUser>("/api/auth/me");
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiClient.post("/api/auth/logout");
    } finally {
      reset();
      setLoading(false);
      router.push("/login");
    }
  }, [reset, setLoading, router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    fetchUser,
    logout,
  };
}
