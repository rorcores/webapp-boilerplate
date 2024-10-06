//app/contexts/UserContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface UserContextType {
  userData: any;
  refreshUserData: () => Promise<void>;
  userExists: boolean | null;
  loadingUserExists: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userData, setUserData] = useState<any>(null);
  // const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [loadingUserExists, setLoadingUserExists] = useState<boolean>(true);

  const fetchUserData = async () => {
    // console.log('fetchUserData called');
    // if (loading) {
    //   return;
    // }

    const now = Date.now();

    // if (lastFetched && now - lastFetched < 1000) {
    //   return;
    // }

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const user_token = sessionData.session.access_token;

      // Fetch user profile information
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/v1/get-users-profile-information`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user_token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        const email = sessionData.session.user.email;
        setUserData({ ...data, email });
        // setLastFetched(now);
      } else if (response.status === 404) {
        setUserData(null);
      } else {
        const errorText = await response.text();
        console.error('Error fetching user details:');
        console.error('Status:', response.status);
        console.error('Status text:', response.statusText);
        console.error('Response body:', errorText);
        setLoading(false);
        setLoadingUserExists(false);
        return;
      }

      // Check if the user exists
      const checkUserResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/v1/check-if-user-exists`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user_token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!checkUserResponse.ok) {
        console.error('Error checking if user exists:', checkUserResponse.statusText);
        setLoading(false);
        setLoadingUserExists(false);
        return;
      }

      const { exists } = await checkUserResponse.json();
      // console.log('fetchUserData: userData updated', userData);
      setUserExists(exists);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
      setLoadingUserExists(false);
      // console.log('fetchUserData: loading set to false');
    }
  };

  const refreshUserData = async () => {
    // setLastFetched(null);
    setLoading(false);
    await fetchUserData();
  };

  useEffect(() => {
    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (['SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'].includes(event)) {
        fetchUserData();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ userData, refreshUserData, userExists, loadingUserExists }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  // console.log('useUserContext section.. fetching');
  const context = useContext(UserContext);
  // console.log('fetched the thing')
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};
