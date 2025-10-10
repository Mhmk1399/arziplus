"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AdminRequestsTable from "@/components/admin/AdminRequestsTable";
import { showToast } from "@/utilities/toast";

export default function AdminRequestsPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useCurrentUser();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      showToast.error("لطفاً وارد سیستم شوید");
      router.push("/auth/sms");
      return;
    }

    if (!user?.roles.includes('admin')) {
      showToast.error("دسترسی مدیریت لازم است");
      router.push("/");
      return;
    }

    setPageLoading(false);
  }, [user, isLoggedIn, loading, router]);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DBFF0] mx-auto mb-4"></div>
          <p className="text-[#0A1D37]/60">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminRequestsTable />
      </div>
    </div>
  );
}