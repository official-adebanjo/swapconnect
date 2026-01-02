"use client";
import React from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const recentOrders = [
  {
    id: "I293DSA39",
    product: " Iphone 13",
    qty: 2,
    date: "2025-05-15",
    amount: "$120",
    status: "Pending",
  },
  {
    id: "U2349SD12",
    product: "Iphone 13",
    qty: 1,
    date: "2025-05-14",
    amount: "$80",
    status: "Approved",
  },
  {
    id: "F2349SU38",
    product: "Macbook Air 2019",
    qty: 3,
    date: "2025-05-13",
    amount: "$60",
    status: "Paused",
  },
];

function RecentOrder() {
  return (
    <div>
      <div className="bg-white dark:bg-card-bg rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="font-semibold text-[18px] text-foreground">
              Recent Orders
            </span>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-3 h-3 bg-[#037F44] rounded-full animate-pulse"></span>
              <span className="text-[#037F44] font-semibold text-[15px]">
                {recentOrders.length} new order
                {recentOrders.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 text-[#ACB7BD] font-medium no-underline text-[15px]"
            >
              Go to Order page
            </Link>
            <MoveRight />
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left px-2 py-2 text-[#848484] font-semibold">
                ID
              </th>
              <th className="text-left px-2 py-2 text-[#848484] font-semibold">
                Item
              </th>
              <th className="text-left px-2 py-2 text-[#848484] font-semibold">
                Qty
              </th>
              <th className="text-left px-2 py-2 text-[#848484] font-semibold">
                Order Date
              </th>
              <th className="text-left px-2 py-2 text-[#848484] font-semibold">
                Amount
              </th>
              <th className="text-left px-2 py-2 text-[#848484] font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-[#F0F0F0] ">
                <td className="px-2 py-2 text-text-primary">{order.id}</td>
                <td className="px-2 py-2 text-text-primary">{order.product}</td>
                <td className="px-2 py-2 text-text-primary">
                  {order.qty ?? 1}
                </td>
                <td className="px-2 py-2 text-text-primary">{order.date}</td>
                <td className="px-2 py-2 text-text-primary">{order.amount}</td>
                <td
                  className={`px-2 py-2 font-semibold text-[12px] rounded-lg text-center w-[30px] h-[10px]  ${
                    order.status === "Approved"
                      ? "text-[#037F44] bg-[#E8F0FF]"
                      : order.status === "Pending"
                      ? "text-[#6C97DE] bg-[#DBF4DC]"
                      : order.status === "Paused"
                      ? "text-[#F87171] bg-[#FFF3E8]"
                      : "text-[#D1A941]"
                  }`}
                >
                  {order.status ?? "Approved"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrder;
