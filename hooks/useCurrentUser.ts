import { useState, useEffect } from 'react';
import { getCurrentUser, AuthUser } from '@/lib/auth';

interface FullUser extends Omit<AuthUser, 'profile'> {
  profile?: {
    avatar?: string;
    bio?: string;
  };
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch full user data from API
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ ...currentUser, ...data.user });
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.log('Error fetching current user:', error);
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        fetchUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  console.log(user , "..............")

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const isLoggedIn = !!user;

  const userDisplayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || 'کاربر گرامی';

  return {
    user: user as any,
    loading,
    isLoggedIn,
    userDisplayName,
    logout
  };
};