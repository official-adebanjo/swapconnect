"use client";
import { useEffect, useState } from "react";
import { Clock, User } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import Image from "next/image";
import { useAuthToken } from "@/hooks/useAuthToken";

interface Bid {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  Product?: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    Account?: {
      firstName: string;
      lastName: string;
    };
  };
  SwapProduct?: {
    id: string;
    name: string;
    imageUrl: string;
    brand: string;
  };
  metaData?: {
    bidType?: string;
    message?: string;
    location?: string;
  };
}

interface BidResponse {
  sellerBids: Bid[];
  buyerBids: Bid[];
}

function BidTable() {
  const [bids, setBids] = useState<BidResponse>({
    sellerBids: [],
    buyerBids: [],
  });
  const [loading, setLoading] = useState(true);
  const token = useAuthToken();
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchBids = async () => {
      try {
        const response = await fetch(`${API_URL}/bid/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("API Response:", data);

        setBids({
          sellerBids: Array.isArray(data.sellerBids) ? data.sellerBids : [],
          buyerBids: Array.isArray(data.buyerBids) ? data.buyerBids : [],
        });
      } catch (error) {
        console.error("Error fetching bids:", error);
        setBids({ sellerBids: [], buyerBids: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [token]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderBidCard = (bid: Bid, isReceived: boolean) => (
    <Link
      key={bid.id}
      href={`/dashboard/bid/${bid.id}`}
      className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 relative shrink-0">
          <Image
            src={
              bid.Product?.imageUrl ||
              "/placeholder.svg?height=80&width=80&query=product"
            }
            alt={bid.Product?.name || "Product"}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-[#353535] truncate">
              {bid.Product?.name || "Unknown Product"}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                bid.status,
              )}`}
            >
              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
            </span>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Bid Amount:</span>
              <span className="font-semibold text-[#037F44]">
                {formatPrice(bid.amount)}
              </span>
            </div>

            {bid.SwapProduct && (
              <div className="flex justify-between">
                <span className="text-gray-600">Swap Offer:</span>
                <span className="text-[#353535] truncate max-w-32">
                  {bid.SwapProduct.name}
                </span>
              </div>
            )}

            {isReceived && bid.Product?.Account && (
              <div className="flex items-center gap-1 text-gray-600">
                <User size={14} />
                <span>
                  {bid.Product.Account.firstName} {bid.Product.Account.lastName}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-gray-600">
              <Clock size={14} />
              <span>{formatDate(bid.createdAt)}</span>
            </div>
          </div>

          {bid.metaData?.message && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 truncate">
              &quot;{bid.metaData.message}&quot;
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#353535] mb-4">
          Bid Management
        </h1>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            className={`px-6 py-2 rounded-t-md text-[16px] font-semibold transition-colors ${
              activeTab === "received"
                ? "bg-[#037F44] text-white"
                : "bg-white text-[#037F44] hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("received")}
          >
            Received Bids ({bids.sellerBids.length})
          </button>
          <button
            className={`px-6 py-2 rounded-t-md text-[16px] font-semibold transition-colors ${
              activeTab === "sent"
                ? "bg-[#037F44] text-white"
                : "bg-white text-[#037F44] hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent Bids ({bids.buyerBids.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-700"></div>
          <span className="ml-3 text-lg text-gray-600">Loading bids...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "received" ? (
            bids.sellerBids.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bids received yet
                </h3>
                <p className="text-gray-600">
                  When someone makes a bid on your products, they&apos;ll appear
                  here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bids.sellerBids.map((bid) => renderBidCard(bid, true))}
              </div>
            )
          ) : bids.buyerBids.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bids sent yet
              </h3>
              <p className="text-gray-600">
                Your sent bids and swap offers will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bids.buyerBids.map((bid) => renderBidCard(bid, false))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BidTable;
