export type Role = "CUSTOMER" | "ADMIN";

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PaymentMethod = "STRIPE" | "SSLCOMMERZ" | "COD";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type CouponType = "PERCENTAGE" | "FIXED";

export interface FilterState {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: "newest" | "price_low_high" | "price_high_low" | "rating";
  ram?: string;
  storage?: string;
  color?: string;
  processor?: string;
}
