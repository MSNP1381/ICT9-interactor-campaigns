import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import {
  createDiscount,
  CreateDiscountData,
  createBulkDiscounts,
} from "../../api/discounts";

// Update the CreateDiscountData type or create a new interface
interface DiscountFormData extends CreateDiscountData {
  discount_value: number;
  discount_type: "percentage" | "fixed_amount" | "free_shipping";
  max_uses?: number; // Add this line
  expiration_date?: moment.Moment; // Add this line
  campaign_id: string; // Add this line
}

const { Option } = Select;

const DiscountCreator: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const discountData: DiscountFormData = {
        code: values.code,
        discount_value: values.discount_value,
        discount_type: values.discount_type,
        max_uses: values.max_uses,
        expiration_date: values.expiration_date?.format("YYYY-MM-DD"),
        is_active: true,
        campaign_id: values.campaign_id,
      };

      await createDiscount(discountData);
      message.success("Discount created successfully");
      form.resetFields();
    } catch (error) {
      console.error("Error creating discount:", error);
      message.error("Failed to create discount");
    } finally {
      setLoading(false);
    }
  };

  const generateBulkDiscounts = async (values: any) => {
    setLoading(true);
    try {
      const baseDiscountData: Omit<DiscountFormData, "code"> = {
        discount_value: values.discount_value,
        discount_type: values.discount_type,
        max_uses: values.max_uses,
        expiration_date: values.expiration_date?.format("YYYY-MM-DD"),
        is_active: true,
        campaign_id: values.campaign_id,
      };

      const bulkDiscounts = Array.from({ length: 1000 }, (_, index) => ({
        ...baseDiscountData,
        code: `${values.code_prefix}-${String(index + 1).padStart(4, "0")}`,
      }));

      await createBulkDiscounts(bulkDiscounts);
      message.success("1000 discounts created successfully");
      form.resetFields();
    } catch (error) {
      console.error("Error creating bulk discounts:", error);
      message.error("Failed to create bulk discounts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="discountCreator"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="code"
        label="Discount Code"
        rules={[{ required: true, message: "Please enter a discount code" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="discount_value"
        label="Discount Value"
        rules={[{ required: true, message: "Please enter a discount value" }]}
      >
        <InputNumber min={0} step={0.01} />
      </Form.Item>
      <Form.Item
        name="discount_type"
        label="Discount Type"
        rules={[{ required: true, message: "Please select a discount type" }]}
      >
        <Select>
          <Option value="percentage">Percentage</Option>
          <Option value="fixed_amount">Fixed Amount</Option>
          <Option value="free_shipping">Free Shipping</Option>
        </Select>
      </Form.Item>
      <Form.Item name="max_uses" label="Maximum Uses">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item name="expiration_date" label="Expiration Date">
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="campaign_id"
        label="Campaign ID"
        rules={[{ required: true, message: "Please enter a campaign ID" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ marginRight: 8 }}
        >
          Create Single Discount
        </Button>
        <Button
          onClick={() => form.validateFields().then(generateBulkDiscounts)}
          loading={loading}
        >
          Generate 1000 Discounts
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DiscountCreator;
