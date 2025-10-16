"use client";

import React, { useState } from "react";
import WalletsList from "./walletsList";
import WithdrawRequestsList from "./outcomes";
import { FaWallet, FaMoneyBillWave } from "react-icons/fa";

const PaymentWrapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"wallets" | "withdraws">("withdraws");

  const tabs = [
    {
      id: "wallets" as const,
      label: "مدیریت کیف پول‌ها",
      icon: <FaWallet className="text-lg" />,
      component: WalletsList,
    },
    {
      id: "withdraws" as const,
      label: "درخواست‌های برداشت",
      icon: <FaMoneyBillWave className="text-lg" />,
      component: WithdrawRequestsList,
    },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || WithdrawRequestsList;

  return (
    <div className="space-y-6 my-32 mx-12">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-[#0A1D37]/10 p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-[#FF7A00] text-white"
                  : "text-[#0A1D37] hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Component */}
      <div>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default PaymentWrapper;
