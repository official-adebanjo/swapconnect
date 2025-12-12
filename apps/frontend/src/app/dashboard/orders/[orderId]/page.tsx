'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, MapPin, XCircle } from 'lucide-react';
import Image from 'next/image';
import { API_URL } from '@/lib/config';
import { useAuthToken } from '@/hooks/useAuthToken';

interface Order {
  image: string;
  brand: string;
  model: string;
  condition: string;
  batteryHealth: string;
  ram: string;
  color: string;
  storage: string;
  verified: boolean;
  currentBid: string;
  location: string;
  swapOffer: string;
  listedItem: string;
  status: string;
}

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const token = useAuthToken();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !orderId) return;
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch order details');
        const data = await response.json();
        console.log('API Response:', data); // For debugging

        // Fixed: Access data.order instead of data.data
        setOrder(data.order);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [token, orderId]);

  const handleAction = async (action: 'accept' | 'decline') => {
    if (!token || !orderId) return;
    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}/${action}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`Failed to ${action} order`);
      alert(`Order ${action}ed successfully!`);
      router.push('/dashboard/orders');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading) return <div className="p-8">Loading order details...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!order) return <div className="p-8">Order not found.</div>;

  // You might need to transform the API data to match your frontend interface
  // The API returns order with OrderProducts array, but your frontend expects different structure
  const transformedOrder = {
    ...order,
    // Extract image from the first product if available
    image: order.OrderProducts?.[0]?.imageUrl || '/default-image.jpg',
    // Extract other properties as needed
    brand: order.OrderProducts?.[0]?.brand || 'Unknown',
    model: order.OrderProducts?.[0]?.model || 'Unknown',
    condition: order.OrderProducts?.[0]?.condition || 'Unknown',
    batteryHealth: order.OrderProducts?.[0]?.batteryHealth || 'Unknown',
    ram: order.OrderProducts?.[0]?.ram || 'Unknown',
    color: order.OrderProducts?.[0]?.color || 'Unknown',
    storage: order.OrderProducts?.[0]?.storage || 'Unknown',
    price: order.OrderProducts?.[0]?.price || '0',
    currentBid: `$${order.totalAmount || '0'}`,
    location: order.Account?.location || 'Unknown location',
    swapOffer: order.OrderProducts?.[0]?.name || 'Unknown item',
    listedItem: order.OrderProducts?.[0]?.name || 'Unknown item',
  };

  return (
    <div className="pt-[110px] pl-[252px] pr-8 pb-8 min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full flex flex-col gap-8">
        {/* First Row: All order details */}
        <div className="flex flex-col md:flex-row gap-8 border-b pb-8">
          <div className="flex flex-col items-center md:items-start">
            <Image
              src={transformedOrder.image}
              alt={
                transformedOrder.brand ||
                transformedOrder.model ||
                'Order Image'
              }
              className="w-40 h-40 object-cover rounded-xl border"
              width={160}
              height={160}
            />
            <div className="mt-4 flex items-center gap-2">
              {transformedOrder.verified ? (
                <>
                  <CheckCircle className="text-[#037F44] w-5 h-5" />
                  <span className="text-xs text-[#037F44] font-semibold">
                    Verified
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="text-[#F87171] w-5 h-5" />
                  <span className="text-xs text-[#F87171] font-semibold">
                    Unverified
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-medium text-[#848484]">Brand: </span>
              <span className="text-[#353535]">{transformedOrder.brand}</span>
            </div>
            <div>
              <span className="font-medium text-[#848484]">Condition: </span>
              <span className="text-[#353535]">
                {transformedOrder.condition}
              </span>
            </div>
            <div>
              <span className="font-medium text-[#848484]">Model: </span>
              <span className="text-[#353535]">{transformedOrder.model}</span>
            </div>
            <div>
              <span className="font-medium text-[#848484]">
                Battery Health:{' '}
              </span>
              <span className="text-[#353535]">
                {transformedOrder.batteryHealth}
              </span>
            </div>
            <div>
              <span className="font-medium text-[#848484]">RAM: </span>
              <span className="text-[#353535]">{transformedOrder.ram}</span>
            </div>
            <div>
              <span className="font-medium text-[#848484]">Color: </span>
              <span className="text-[#353535]">{transformedOrder.color}</span>
            </div>
            <div>
              <span className="font-medium text-[#848484]">Storage: </span>
              <span className="text-[#353535]">{transformedOrder.storage}</span>
            </div>
          </div>
        </div>
        {/* Second Row: Bid, location, swap offer, listed item, actions */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-medium text-[#848484]">Price: </span>
              <span className="text-[#037F44] font-bold">
                {transformedOrder.price.toLocaleString('en', {style: 'currency', currency: 'NGN'})}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#037F44]" />
              <span className="font-medium text-[#848484]">Location: </span>
              <span className="text-[#353535]">
                {transformedOrder.location}
              </span>
            </div>
            <div>
              <span className="font-medium text-[#848484]">Swap Offer: </span>
              <span className="text-[#353535]">
                {transformedOrder.swapOffer}
              </span>
            </div>
            <div>
              <span className="font-medium text-[#848484]">Listed Item: </span>
              <span className="text-[#353535]">
                {transformedOrder.listedItem}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-6 md:mt-0">
            <button
              className="bg-[#037F44] hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              onClick={() => handleAction('accept')}
              disabled={order.status === 'accepted'}
            >
              Accept
            </button>
            <button
              className="bg-[#F87171] hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              onClick={() => handleAction('decline')}
              disabled={order.status === 'declined'}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
