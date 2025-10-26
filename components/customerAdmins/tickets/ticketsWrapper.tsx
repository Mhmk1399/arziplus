"use client";
import { Suspense } from "react";
import CustomerTicketsList from "./ticketsList";

const TicketsWrapper = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0A1D37]/20 border-t-[#0A1D37]"></div>
            </div>
          }
        >
          <CustomerTicketsList />
        </Suspense>
      </div>
    </div>
  );
};

export default TicketsWrapper;