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
    <div className="space-y-6 my-8 px-4">
      

      {/* Active Component */}
      <div>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default PaymentWrapper;
