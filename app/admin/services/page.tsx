"use client";
import React from "react";
import ServiceManager from "@/components/serviceBuilder/ServiceManager";

export default function AdminServicesPage() {
  return (
    <div className="min-h-screen mt-20 p-4">
      <ServiceManager mode="admin" />
    </div>
  );
}
