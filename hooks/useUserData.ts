import { useState, useEffect } from 'react';

interface UserData {
  _id?: string;
  username?: string;
  status?: string;
  roles?: string[];
  nationalCredentials?: {
    firstName?: string;
    lastName?: string;
    nationalNumber?: string;
    nationalCardImageUrl?: string;
    verificationImageUrl?: string;
  };
  contactInfo?: {
    homePhone?: string;
    mobilePhone?: string;
    email?: string;
    address?: string;
    postalCode?: string;
  };
  bankingInfo?: Array<{
    _id?: string;
    bankName?: string;
    cardNumber?: string;
    shebaNumber?: string;
    accountHolderName?: string;
  }>;
  verifications?: {
    email?: {
      isVerified?: boolean;
      verifiedAt?: string;
    };
    phone?: {
      isVerified?: boolean;
      verifiedAt?: string;
    };
    identity?: {
      status?: 'not_submitted' | 'pending' | 'approved' | 'rejected';
      submittedAt?: string;
      reviewedAt?: string;
      rejectionReason?: string;
    };
  };
}

export const useUserData = (userId?: string) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const url = userId ? `/api/auth/me?userId=${userId}` : '/api/auth/me';
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات کاربر');
      }

      const result = await response.json();
      setUserData(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserSecurity = async (updates: {
    username?: string;
    password?: string;
    roles?: string[];
    status?: string;
  }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId || undefined,
          ...updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در به‌روزرسانی اطلاعات امنیتی");
      }

      await loadUserData(); // Refresh data
      return true;
    } catch (error) {
      console.error("Update security error:", error);
      throw error;
    }
  };

  const updateNationalCredentials = async (updates: {
    firstName?: string;
    lastName?: string;
    nationalNumber?: string;
    nationalCardImageUrl?: string;
    verificationImageUrl?: string;
  }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/nationalverifications", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId || undefined,
          ...updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در به‌روزرسانی اطلاعات هویتی");
      }

      await loadUserData(); // Refresh data
      return true;
    } catch (error) {
      console.error("Update national credentials error:", error);
      throw error;
    }
  };

  const updateContactInfo = async (updates: {
    homePhone?: string;
    mobilePhone?: string;
    email?: string;
    address?: string;
    postalCode?: string;
  }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/contact", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId || undefined,
          ...updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در به‌روزرسانی اطلاعات تماس");
      }

      await loadUserData(); // Refresh data
      return true;
    } catch (error) {
      console.error("Update contact info error:", error);
      throw error;
    }
  };

  const addBankingInfo = async (updates: {
    bankName: string;
    cardNumber: string;
    shebaNumber: string;
    accountHolderName: string;
  }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/banckingifo", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId || undefined,
          ...updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در افزودن اطلاعات بانکی");
      }

      await loadUserData(); // Refresh data
      return true;
    } catch (error) {
      console.error("Add banking info error:", error);
      throw error;
    }
  };

  const sendEmailVerification = async (email: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/email", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId || undefined,
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ارسال کد تایید ایمیل");
      }

      return true;
    } catch (error) {
      console.error("Send email verification error:", error);
      throw error;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/email", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId || undefined,
          email,
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در تایید ایمیل");
      }

      await loadUserData(); // Refresh data
      return true;
    } catch (error) {
      console.error("Verify email error:", error);
      throw error;
    }
  };

  const sendPhoneVerification = async (phone: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/phoneVerification", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId || undefined,
          phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ارسال کد تایید پیامک");
      }

      return true;
    } catch (error) {
      console.error("Send phone verification error:", error);
      throw error;
    }
  };

  const verifyPhone = async (phone: string, code: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/phoneVerification", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId || undefined,
          phone,
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در تایید شماره تلفن");
      }

      await loadUserData(); // Refresh data
      return true;
    } catch (error) {
      console.error("Verify phone error:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  return {
    userData,
    loading,
    error,
    refetch: loadUserData,
    updateUserSecurity,
    updateNationalCredentials,
    updateContactInfo,
    addBankingInfo,
    sendEmailVerification,
    verifyEmail,
    sendPhoneVerification,
    verifyPhone,
  };
};