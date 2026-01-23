"use client";

import PersonalInfo from "@/components/PersonalInfo";
import NotificationSettings from "@/components/notification-settings";
import AccountSettings from "@/components/account-settings";
import { useEffect, useState } from "react";
import { useAuthToken } from "@/hooks/useAuthToken";

function Page() {
  const token = useAuthToken();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "personal" | "notifications" | "account"
  >("personal");

  useEffect(() => {
    // Only run in the browser
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);
  }, []);

  if (!token || !userId) {
    return <p>Loading...</p>;
  }

  return (
    <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB]">
      <div className="flex gap-2 mb-8 bg-white w-fit rounded-md p-1">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-6 py-2 rounded-md text-[16px] transition ${
            activeTab === "personal"
              ? "bg-[#037F44] text-white"
              : "bg-transparent text-[#037F44] hover:bg-[#e6f9f0]"
          }`}
        >
          Personal Info
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-6 py-2 rounded-md text-[16px] transition ${
            activeTab === "notifications"
              ? "bg-[#037F44] text-white"
              : "bg-transparent text-[#037F44] hover:bg-[#e6f9f0]"
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`px-6 py-2 rounded-md text-[16px] transition ${
            activeTab === "account"
              ? "bg-[#037F44] text-white"
              : "bg-transparent text-[#037F44] hover:bg-[#e6f9f0]"
          }`}
        >
          Account
        </button>
      </div>

      {activeTab === "personal" ? (
        <PersonalInfo />
      ) : activeTab === "notifications" ? (
        <NotificationSettings />
      ) : (
        <AccountSettings />
      )}
    </div>
  );
}

export default Page;
