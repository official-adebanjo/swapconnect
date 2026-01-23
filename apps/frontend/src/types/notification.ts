export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "order_created"
    | "order_accepted"
    | "order_rejected"
    | "order_shipped"
    | "order_completed"
    | "product_approved"
    | "product_rejected"
    | "payment_received"
    | "referral_bonus"
    | "general"
    | "deposit_successful"
    | "deposit_failed"
    | "withdrawal_successful"
    | "withdrawal_failed"
    | "transfer_received"
    | "transfer_sent"
    | "bid_created"
    | "bid_accepted"
    | "bid_rejected"
    | "bid_completed"
    | "swap_offer_received"
    | "swap_offer_accepted"
    | "swap_offer_rejected";
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}
