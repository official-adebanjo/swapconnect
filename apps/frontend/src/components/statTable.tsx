"use client";
import React, { useEffect, useState } from "react";
import { CircleDollarSign, Package } from "lucide-react";
// import Cookies from "js-cookie";
import { API_URL } from "../lib/config";
import { useAuthToken } from "../hooks/useAuthToken";

interface Balance {
  walletBalance: string;
  totalProducts: string;
  totalProductsSold: string;
}

function StatTable() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const token = useAuthToken(); // Use the custom hook to get the token

  useEffect(() => {
    if (!token) return; // Exit early if token is not available
    const fetchStats = async () => {
      try {
        // const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/users/dashboard-analytics`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        // console.log("API Response:", data);

        if (data?.data) {
          setBalance(data.data);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-10 mb-10">
        {/* First row: Total Balance and Total Products */}
        <div className="flex gap-4 md:gap-10 w-full">
          {/* Total Balance */}
          <div className="flex flex-col md:flex-row bg-[#fff] rounded-[12px] shadow w-1/2 md:w-[323px] h-[120px] md:h-[97px] pl-5 py-5 md:p-[28px_32px] md:gap-5 md:items-center">
            <span className=" bg-[#F7F8FB] h-[40px] w-[40px] md:h-[56px] md:w-[56px] rounded-full flex items-center justify-center mb-4">
              <CircleDollarSign
                color="#037F44"
                size={24}
                className="md:size-8"
              />
            </span>
            <div className="flex flex-col">
              <span className="text-[#BEBEBE] text-[14px] md:mb-2">
                Total Balance
              </span>
              <span className="text-[#3E344F] font-bold text-[16px] md:text-[24px]">
                ₦{balance?.walletBalance || "0"}
              </span>
            </div>
          </div>

          {/* Total Products */}
          <div className="flex flex-col md:flex-row bg-[#fff] rounded-[12px] shadow w-1/2 md:w-[323px] h-[120px] md:h-[97px] pl-5 py-5 md:p-[28px_32px] md:gap-5 md:items-center">
            <span className=" bg-[#F7F8FB] h-[40px] w-[40px] md:h-[56px] md:w-[56px] rounded-full flex items-center justify-center mb-4">
              <Package color="#037F44" size={24} className="md:size-8" />
            </span>
            <div className="flex flex-col">
              <span className="text-[#BEBEBE] text-[14px] md:mb-2">
                Total Products
              </span>
              <span className="text-[#3E344F] font-bold text-[16px] md:text-[24px]">
                {balance?.totalProducts || "0"}
              </span>
            </div>
          </div>
        </div>

        {/* Second row: Total Sold */}
        <div className="flex w-full md:w-auto">
          <div className="flex flex-col md:flex-row bg-[#fff] rounded-[12px] shadow w-full md:w-[323px] h-[120px] md:h-[97px] pl-5 py-5 md:p-[28px_32px] md:gap-5 md:items-center">
            <span className=" bg-[#F7F8FB] h-[40px] w-[40px] md:h-[56px] md:w-[56px] rounded-full flex items-center justify-center mb-4">
              <Package color="#037F44" size={24} className="md:size-8" />
            </span>
            <div className="flex flex-col">
              <span className="text-[#BEBEBE] text-[14px] md:mb-2">
                Total Sold
              </span>
              <span className="text-[#3E344F] font-bold text-[16px] md:text-[24px]">
                {balance?.totalProductsSold || "0"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatTable;
