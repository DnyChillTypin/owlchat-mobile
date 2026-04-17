import React, { createContext, useContext, useEffect, useCallback, useMemo, useRef } from "react";
import { useUserProfile as useUserProfileHook } from "@/hooks/use-user-profile";
import { useAuthContext } from "@/providers/auth-provider";
import type { UserProfile } from "@/types/user-profile.type";

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  fetchProfileById: (id: string) => Promise<UserProfile | undefined>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading, error, fetchUserProfile, fetchProfileById } = useUserProfileHook();
  const isInitialMount = useRef(true);

  // 1. Stable refresh function
  const refreshProfile = useCallback(async () => {
    try {
      await fetchUserProfile(null);
    } catch (err) {
      console.error("Profile Provider: Error fetching profile", err);
    }
  }, [fetchUserProfile]);

  const { isAuthenticated } = useAuthContext();

  // 2. Fetch profile when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("[UserProfileProvider] Authenticated, fetching profile...");
      refreshProfile();
    } else {
      console.log("[UserProfileProvider] Not authenticated, clearing profile...");
    }
  }, [refreshProfile, isAuthenticated]);

  // 3. Memoize value to prevent re-rendering consumers when provider re-renders for other reasons
  const value = useMemo(() => ({
    profile,
    loading,
    error,
    refreshProfile,
    fetchProfileById
  }), [profile, loading, error, refreshProfile, fetchProfileById]);

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfileContext must be used within a UserProfileProvider");
  }
  return context;
};
