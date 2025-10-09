"use client";
import React from 'react';
import ServiceManager from '@/components/serviceBuilder/ServiceManager';

export default function AdminServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <ServiceManager mode="admin" />
    </div>
  );
}