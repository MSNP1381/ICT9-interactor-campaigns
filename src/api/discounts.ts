import { api } from "./config";

export interface Discount {
  id: string;
  code: string;
  type: string;
  value: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDiscountData {
  code: string;
  discount_value: number;
  discount_type: "percentage" | "fixed_amount" | "free_shipping";
  max_uses?: number;
  expiration_date?: string;
  is_active: boolean;
  campaign_id: string;
}

export const getDiscounts = async () => {
  const response = await api.get<Discount[]>("/discounts");
  return response.data;
};

export const getDiscount = async (id: string) => {
  const response = await api.get<Discount>(`/discounts/${id}`);
  return response.data;
};

export const createDiscount = async (data: CreateDiscountData) => {
  const response = await api.post("/discount-codes/", data);
  return response.data;
};

export const updateDiscount = async (
  id: string,
  discountData: Partial<CreateDiscountData>,
) => {
  const response = await api.put<Discount>(`/discounts/${id}`, discountData);
  return response.data;
};

export const deleteDiscount = async (id: string) => {
  await api.delete(`/discounts/${id}`);
};

export const createBulkDiscounts = async (
  discounts: CreateDiscountData[],
): Promise<void> => {
  const response = await api.post("/discount-codes/bulk", { discounts });
  return response.data;
};
