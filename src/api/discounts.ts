import { api } from "./config";

export interface Discount {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed_amount" | "free_shipping";
  discount_value: number;
  expiration_date?: string;
  max_uses?: number;
  is_active: boolean;
  campaign_id: string;
}

export const getDiscounts = async () => {
  const response = await api.get<Discount[]>("/discounts");
  return response.data;
};

// ... other discount-related API functions
