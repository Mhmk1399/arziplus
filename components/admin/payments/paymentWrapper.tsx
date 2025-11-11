"use client";

import React, { useState } from "react";
import { FaChartLine, FaCog } from "react-icons/fa";
import ReferralAnalytics from "./referralAnalytics";
import ReferralRewardRulesManager from "./referralRewardRulesManager";

type TabType = "analytics" | "reward-rules";

const PaymentWrapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("analytics");

  // Tab configuration
  const tabs = [
    {
      id: "analytics" as TabType,
      label: "تحلیل ارجاعات",
      icon: <FaChartLine className="text-lg" />,
    },
    {
      id: "reward-rules" as TabType,
      label: "مدیریت قوانین پاداش",
      icon: <FaCog className="text-lg" />,
    },
  ];

  // Render active tab content
  const renderActiveContent = () => {
    switch (activeTab) {
      case "analytics":
        return <ReferralAnalytics />;
      case "reward-rules":
        return <ReferralRewardRulesManager />;
      default:
        return <ReferralAnalytics />;
    }
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Content Area */}
        <div className="backdrop-blur-sm bg-white/90 border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-[#0A1D37] to-[#0A1D37]/90 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-[#0A1D37] shadow-md"
                      : "bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            {renderActiveContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentWrapper;
