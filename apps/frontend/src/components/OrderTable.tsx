'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/lib/config';
import { useAuthToken } from '@/hooks/useAuthToken';

interface Order {
  id: string;
  image: string;
  price: string;
  location: string;
  swapOffer: string;
  listedItem: string;
  verified: boolean;
}

function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'in-progress' | 'request' | 'completed'
  >('in-progress');
  const token = useAuthToken();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('API Response:', data);

        // Combine buyer and seller orders based on active tab
        let filteredOrders = [];

        if (activeTab === 'in-progress') {
          // For in-progress, show both buyer and seller orders that are not completed
          filteredOrders = [
            ...(data.buyerOrders || []),
            ...(data.sellerOrders || []),
          ].filter((order) => order.status !== 'completed');
        } else if (activeTab === 'request') {
          // For requests, show only seller orders that are pending
          filteredOrders = (data.sellerOrders || []).filter(
            (order) => order.status === 'pending'
          );
        } else if (activeTab === 'completed') {
          // For completed, show both buyer and seller orders that are completed
          filteredOrders = [
            ...(data.buyerOrders || []),
            ...(data.sellerOrders || []),
          ].filter((order) => order.status === 'completed');
        }

        // Transform the API data to match your frontend interface
        const transformedOrders = filteredOrders.map((order) => ({
          id: order.id,
          image: order.OrderProducts?.[0]?.imageUrl || '/default-image.jpg',
          price: `N${order.OrderProducts?.[0]?.price || '0'}`,
          location: order.Account?.location || 'Unknown location',
          swapOffer: order.OrderProducts?.[0]?.name || 'Unknown item',
          listedItem: order.OrderProducts?.[0]?.name || 'Unknown item',
          verified: true, // You might want to adjust this based on actual data
        }));

        setOrders(transformedOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setOrders([]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, activeTab]); // Added activeTab as dependency

  return (
    <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB]">
      <div className="md:flex-row items-center gap-4 mb-8  bg-white w-fit justify-center rounded-md">
        <button
          onClick={() => setActiveTab('in-progress')}
          className={`px-6 py-2 rounded-md text-[16px] transition ${
            activeTab === 'in-progress'
              ? 'bg-[#037F44] text-white'
              : 'bg-[#F8F9FB] text-[#037F44] hover:bg-[#e6f9f0]'
          }`}
        >
          In Progress
        </button>

        <button
          onClick={() => setActiveTab('request')}
          className={`px-6 py-2 rounded-md text-[16px] transition ${
            activeTab === 'request'
              ? 'bg-[#037F44] text-white'
              : 'bg-[#F8F9FB] text-[#037F44] hover:bg-[#e6f9f0]'
          }`}
        >
          Request
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-2 rounded-md text-[16px] transition ${
            activeTab === 'completed'
              ? 'bg-[#037F44] text-white'
              : 'bg-[#F8F9FB] text-[#037F44] hover:bg-[#e6f9f0]'
          }`}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div>
          <p className="text-center text-[#848484] mt-6">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="bg-white rounded-xl shadow p-4 flex md:flex-col items-center relative"
            >
              <div className="w-28 h-28 mb-4 relative">
                <Image
                  src={order.image}
                  alt={order.listedItem}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover rounded-lg"
                />
                {order.verified && (
                  <span className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                    <CheckCircle
                      className="text-[#037F44]"
                      size={20}
                    />
                  </span>
                )}
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-[#037F44] text-sm">
                    Price: <span>{order.price}</span>
                  </p>
                  <span className="flex items-center text-xs text-[#353535]">
                    <MapPin className="w-4 h-4 mr-1 text-[#037F44]" />
                    {order.location.split(',')[0]}
                  </span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-xs text-[#848484]">Swap Offer</span>
                  <span className="text-xs text-[#353535]">
                    {order.swapOffer}
                  </span> */}
                {/* </div> */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#848484]">Listed Item</span>
                  <span className="text-xs text-[#353535]">
                    {order.listedItem}
                  </span>
                </div>
                {order.verified && (
                  <div className="flex items-center mt-2">
                    <CheckCircle className="text-[#037F44] w-4 h-4 mr-1" />
                    <span className="text-xs text-[#037F44] font-semibold">
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderTable;
