'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, MapPin, ArrowLeft, Clock } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { useAuthToken } from '@/hooks/useAuthToken';

interface BidDetail {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  verified: boolean;
  location: string;
  swapOffer?: {
    id: string;
    image: string;
    name: string;
    brand: string;
  };
  bidType?: string;
  message?: string;
}

export default function BidDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bidId = params.bidsId as string;
  const token = useAuthToken();

  const [bid, setBid] = useState<BidDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !bidId) {
      setLoading(false);
      return;
    }

    const fetchBidDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/bid/${bidId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.status && data.bid) {
          setBid(data.bid);
        } else {
          setError('Bid not found');
        }
      } catch (err) {
        console.error('Error fetching bid:', err);
        setError('Failed to load bid details');
      } finally {
        setLoading(false);
      }
    };

    fetchBidDetail();
  }, [token, bidId]);

  const handleAcceptBid = async () => {
    if (!bid || actionLoading) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/bid/${bidId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok) {
        setBid((prev) => (prev ? { ...prev, status: 'accepted' } : null));
        alert('Bid accepted successfully! An order has been created.');
      } else {
        alert(data.error || 'Failed to accept bid');
      }
    } catch (err) {
      console.error('Error accepting bid:', err);
      alert('Failed to accept bid');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectBid = async () => {
    if (!bid || actionLoading) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/bid/${bidId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok) {
        setBid((prev) => (prev ? { ...prev, status: 'rejected' } : null));
        alert('Bid rejected successfully');
      } else {
        alert(data.error || 'Failed to reject bid');
      }
    } catch (err) {
      console.error('Error rejecting bid:', err);
      alert('Failed to reject bid');
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB]">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-700"></div>
          <span className="ml-3 text-lg text-gray-600">
            Loading bid details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !bid) {
    return (
      <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB]">
        <div className="text-center py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative inline-block">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">
              {error || 'Bid not found'}
            </span>
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#037F44] hover:text-[#025c32] transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Bids
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          {/* Status and Date */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#353535] mb-2">
                Bid Details
              </h1>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    bid.status
                  )}`}
                >
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">{formatDate(bid.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Details */}
            <div>
              <h2 className="text-lg font-semibold text-[#353535] mb-4">
                Product Details
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <Image
                      src={
                        bid.image ||
                        '/placeholder.svg?height=96&width=96&query=product'
                      }
                      alt={bid.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                    {bid.verified && (
                      <span className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow">
                        <CheckCircle
                          className="text-[#037F44]"
                          size={16}
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#353535] mb-1">
                      {bid.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{bid.brand}</p>
                    <p className="text-lg font-bold text-[#037F44]">
                      {formatPrice(bid.price)}
                    </p>
                    {bid.location && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                        <MapPin size={14} />
                        <span>{bid.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                {bid.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">{bid.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bid Information */}
            <div>
              <h2 className="text-lg font-semibold text-[#353535] mb-4">
                Bid Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Bid Amount
                  </label>
                  <p className="text-xl font-bold text-[#037F44]">
                    {formatPrice(bid.amount)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Bid Type
                  </label>
                  <p className="text-sm text-[#353535] capitalize">
                    {bid.bidType || (bid.swapOffer ? 'Swap' : 'Cash')}
                  </p>
                </div>

                {bid.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Message
                    </label>
                    <p className="text-sm text-[#353535] bg-white p-3 rounded border">
                      {bid.message}
                    </p>
                  </div>
                )}

                {bid.swapOffer && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Swap Offer
                    </label>
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={
                              bid.swapOffer.image ||
                              '/placeholder.svg?height=64&width=64&query=product'
                            }
                            alt={bid.swapOffer.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-[#353535]">
                            {bid.swapOffer.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {bid.swapOffer.brand}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {bid.status === 'pending' && (
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button
                onClick={handleAcceptBid}
                disabled={actionLoading}
                className="flex-1 bg-[#037F44] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#025c32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading ? 'Processing...' : 'Accept Bid'}
              </button>
              <button
                onClick={handleRejectBid}
                disabled={actionLoading}
                className="flex-1 border border-red-500 text-red-500 py-3 px-6 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading ? 'Processing...' : 'Reject Bid'}
              </button>
            </div>
          )}

          {bid.status === 'accepted' && (
            <div className="mt-8 pt-6 border-t">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className="text-green-600"
                    size={20}
                  />
                  <span className="text-green-800 font-medium">
                    Bid Accepted - Order has been created and the buyer has been
                    notified.
                  </span>
                </div>
              </div>
            </div>
          )}

          {bid.status === 'rejected' && (
            <div className="mt-8 pt-6 border-t">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✕</span>
                  <span className="text-red-800 font-medium">
                    Bid Rejected - The bidder has been notified.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
