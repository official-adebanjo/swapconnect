"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
// import Cookies from "js-cookie";
import { API_URL } from "../lib/config";
import { useAuthToken } from "../hooks/useAuthToken";
import { Copy } from "lucide-react"; // add at the top

const topProducts = [
  { name: " Iphone 13", views: 50, bids: 5 },
  { name: "Iphone 13", views: 20, bids: 2 },
];

interface Referral {
  earingsByPurpose: string;
  totalCount: string;
  referralCode: string;
}

function ReferralTable() {
  const [refers, setRefers] = useState<Referral | null>(null);
  const [copied, setCopied] = useState(false);
  const token = useAuthToken();

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // Fetch referral code
        const userRes = await fetch(`${API_URL}/users/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await userRes.json();
        console.log("User API Response:", userData);

        const referralCode = userData?.data?.referralCode ?? "";

        // Fetch earnings and total referrals
        const analyticsRes = await fetch(
          `${API_URL}/users/dashboard-analytics`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const analyticsData = await analyticsRes.json();
        console.log("Analytics API Response:", analyticsData);

        const transactions = analyticsData?.data?.transactions ?? {};

        setRefers({
          earingsByPurpose: transactions.earingsByPurpose ?? "0",
          totalCount: transactions.totalCount ?? "0",
          referralCode,
        });
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    fetchData();
  }, [token]);

  const copyToClipboard = () => {
    if (refers?.referralCode) {
      const referralLink = `https://swapco.com/invite/${refers.referralCode}`;
      navigator.clipboard.writeText(referralLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div>
      {" "}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex flex-col gap-4 flex-2">
          {/* Refer and Earn Card */}

          <div
            className="flex rounded-[12px] relative overflow-hidden px-6 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-cover bg-center"
            style={{ backgroundImage: "url('/refer_bg.png')" }}
          >
            <div className="flex flex-col w-full md:w-[332px]">
              <div className="flex flex-col w-[172px] md:w-[332px]">
                <span className="font-bold text-lg md:text-2xl text-[#202020] mb-2">
                  Discover, Swap, and Sell Your Devices.
                </span>
                <span className="text-[#202020] text-sm md:text-[16px] mb-3">
                  Enter in this creative world. Introduce others to this
                  platform and get rewards!
                </span>
              </div>

              <button className="bg-[#037F44] text-white rounded-md md:w-[171px] md:h-12 w-[141px] h-[32px] px-5 font-medium cursor-pointer text-[14px] md:text-[15px]">
                Refer and Earn
              </button>
            </div>
          </div>

          {/* Top Products */}
          <div className="hidden md:block flex flex-col flex-1.2 bg-white rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] min-w-0">
            <span className="font-semibold text-[20px] text-[#05004E] mb-4">
              Top Products
            </span>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th className="text-left p-2 text-[#96A5B8] font-normal text-[14px]">
                    #
                  </th>
                  <th className="text-left p-2 text-[#96A5B8] font-normal text-[14px]">
                    Name
                  </th>
                  <th className="text-left p-2 text-[#96A5B8] font-normal text-[14px]">
                    Views
                  </th>
                  <th className="text-left p-2 text-[#96A5B8] font-normal text-[14px]">
                    Bids
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((prod, idx) => (
                  <tr
                    key={prod.name}
                    // style={{ borderBottom: "1px solid #F0F0F0" }}
                  >
                    <td className="p-2 text-[#444A6D]">{idx + 1}</td>
                    <td className="p-2 text-[#444A6D]">{prod.name}</td>
                    <td className="p-2 text-[#444A6D]">{prod.views ?? 0}</td>
                    <td className="border border-[#037F44] w-[50px] h-[24px] bg-[#F0FDF4] p-4 text-[#00E58F] rounded-xl flex items-center">
                      {prod.bids ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Stats (column) */}
        <div className="flex flex-col gap-4 flex-1 justify-between bg-white p-6 rounded-[12px]">
          {/* Tokens Earned */}
          <div className="bg-[#DCFCE7] rounded-[12px] p-5 shadow flex flex-col items-start min-w-0 h-[180px]">
            <div className="flex gap-20">
              <div className="flex flex-col">
                <span className="text-[#202020] text-[14px] md:text-[15px] mb-2">
                  Your token balance
                </span>
                <span className="text-[#037F44] font-bold text-[24px] md:text-[22px]">
                  ${refers?.earingsByPurpose ?? "0"}
                </span>
              </div>
              <Image src="/Coin.svg" alt="" width={60} height={60} />
            </div>

            <div className="flex flex-col mt-3 w-full">
              <span className="text-[#202020] text-[14px]">
                Your referral link:
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[#202020] font-semibold text-[16px] break-all">
                  {refers?.referralCode
                    ? `https://swapco.com/invite/${refers.referralCode}`
                    : "Loading..."}
                </span>

                {refers?.referralCode && (
                  <Copy
                    size={18}
                    className="cursor-pointer text-[#037F44] hover:text-[#025d33]"
                    onClick={copyToClipboard}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Total Referrals */}
          <div className="bg-[#E8F0FF] rounded-[12px] p-5 md:h-[180px] h-[94px] shadow flex flex-col items-start min-w-0">
            <span className="text-[#848484] text-[15px] mb-2">
              Total number referred
            </span>
            <span className="text-[#3E344F] font-bold text-[22px]">
              {refers?.totalCount ?? 0}
            </span>
          </div>
        </div>
      </div>
      {copied && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Referral link copied to clipboard!
        </div>
      )}
    </div>
  );
}

export default ReferralTable;
