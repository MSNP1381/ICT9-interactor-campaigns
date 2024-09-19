import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  message,
  Spin,
} from "antd";
import { createBulkDiscounts } from "../../api/discounts";
import { getCampaigns, Campaign } from "../../api/campaigns";
import moment from "moment";

interface DiscountFormData {
  code_prefix: string;
  discount_value: number;
  discount_type: "percentage" | "fixed_amount" | "free_shipping";
  max_uses?: number;
  expiration_date?: moment.Moment;
  campaign_id: string;
  bulk_count: number;
}

const { Option } = Select;

const DiscountCreator: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const fetchedCampaigns = await getCampaigns();
      setCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      message.error("Failed to fetch campaigns");
    } finally {
      setCampaignsLoading(false);
    }
  };

  const generateBulkDiscounts = async (values: DiscountFormData) => {
    setLoading(true);
    try {
      const bulkDiscounts:any = {
        code: `${values.code_prefix}-`,
        discount_value: values.discount_value,
        discount_type: values.discount_type,
        max_uses: values.max_uses,
        expiration_date: values.expiration_date?.format("YYYY-MM-DD"),
        is_active: true,
        campaign_id: values.campaign_id,
      }

      await createBulkDiscounts(bulkDiscounts);
      message.success(`${values.bulk_count} discounts created successfully`);
      form.resetFields();
    } catch (error) {
      console.error("Error creating bulk discounts:", error);
      message.error("Failed to create bulk discounts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form
        form={form}
        name="discountCreator"
        onFinish={generateBulkDiscounts}
        layout="vertical"
      >
        <Form.Item
          name="code_prefix"
          label="Base Discount Code"
          rules={[{ required: true, message: "Please enter a base discount code for bulk generation" }]}
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
          label="Campaign"
          rules={[{ required: true, message: "Please select a campaign" }]}
        >
          {campaignsLoading ? (
            <Spin size="small" />
          ) : (
            <Select>
              {campaigns.map((campaign) => (
                <Option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          name="bulk_count"
          label="Number of Discounts to Generate"
          rules={[{ required: true, message: "Please enter the number of discounts to generate" }]}
        >
          <InputNumber min={1} defaultValue={1} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Generate Bulk Discounts
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DiscountCreator;
