import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Modal, Spin } from "antd";
import { createWidget, WidgetCreate } from "../../api/widgets";
import {
  getWidgetTemplates,
  WidgetTemplate,
  getWidgetTemplate,
} from "../../api/widgetTemplates";
import nunjucks from "nunjucks";
import { getCampaigns, Campaign } from "../../api/campaigns";
import CustomTemplateCreator from "./CustomTemplateCreator";

const { Option } = Select;

interface WidgetFormValues {
  name: string;
  widget_template_id: string;
  config: string;
  description: string;
  campaign_id: string;
  widget_type: string;
}

interface WidgetCreatorProps {
  onWidgetCreated: () => void;
}

const WidgetCreator: React.FC<WidgetCreatorProps> = ({ onWidgetCreated }) => {
  const [form] = Form.useForm<WidgetFormValues>();
  const [loading, setLoading] = useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [templates, setTemplates] = useState<WidgetTemplate[]>([]);
  const [isTemplatesLoading, setIsTemplatesLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WidgetTemplate | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(true);
  const [customTemplate, setCustomTemplate] = useState<string>("");
  const [extractedVariables, setExtractedVariables] = useState<string[]>([]);
  const [isCustomTemplateModalVisible, setIsCustomTemplateModalVisible] = useState(false);

  const widgetTypes = ['game', 'survey', 'quiz', 'form', 'calculator'];

  useEffect(() => {
    fetchTemplates();
    fetchCampaigns();
  }, []);

  const fetchTemplates = async () => {
    setIsTemplatesLoading(true);
    try {
      const fetchedTemplates = await getWidgetTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      message.error("Failed to fetch widget templates");
    } finally {
      setIsTemplatesLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    setIsCampaignsLoading(true);
    try {
      const defaultHostId = localStorage.getItem("defaultHostId");
      const fetchedCampaigns = await getCampaigns(0, 100, defaultHostId ?? undefined);
      const activeCampaigns = fetchedCampaigns.filter(campaign => campaign.status === "active");
      setCampaigns(activeCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      message.error("Failed to fetch campaigns");
    } finally {
      setIsCampaignsLoading(false);
    }
  };

  const onFinish = async (values: WidgetFormValues) => {
    if (!selectedTemplate) {
      message.error("Please select a widget template");
      return;
    }

    setLoading(true);
    try {
      const widgetCreateData: WidgetCreate = {
        name: values.name,
        description: values.description,
        config: JSON.parse(values.config),
        host_id: localStorage.getItem("defaultHostId") ?? "",
        widget_template_id: values.widget_template_id,
        campaign_id: values.campaign_id,
        widget_type: values.widget_type,
      };
      await createWidget(widgetCreateData);
      message.success("Widget created successfully");
      form.resetFields();
      setSelectedTemplate(null);
      onWidgetCreated();
    } catch (error) {
      console.error("Error creating widget:", error);
      message.error("Failed to create widget");
    } finally {
      setLoading(false);
    }
  };

  const showTemplateModal = () => {
    setIsTemplateModalVisible(true);
  };

  const handleTemplateModalCancel = () => {
    setIsTemplateModalVisible(false);
  };

  const handleSelectTemplate = async (templateId: string) => {
    try {
      const template = await getWidgetTemplate(templateId);
      setSelectedTemplate(template);
      form.setFieldsValue({
        widget_template_id: template.id,
        config: JSON.stringify(template.config, null, 2),
      });
    } catch (error) {
      console.error("Error fetching template:", error);
      message.error("Failed to fetch widget template");
    }
  };

  const handleTestWidget = () => {
    if (!selectedTemplate) {
      message.error("Please select a widget template");
      return;
    }

    const values = form.getFieldsValue();
    const config = JSON.parse(values.config);

    const env = new nunjucks.Environment();
    const renderedWidget = env.renderString(selectedTemplate.template, config);
    setTestResult(renderedWidget);
    setIsTestModalVisible(true);
  };

  const handleTestModalCancel = () => {
    setIsTestModalVisible(false);
  };

  const handleCustomTemplateCreated = (newTemplate: WidgetTemplate) => {
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    form.setFieldsValue({
      widget_template_id: newTemplate.id,
      config: JSON.stringify(newTemplate.config, null, 2),
    });
    setIsCustomTemplateModalVisible(false);
  };

  return (
    <>
      <Form
        form={form}
        name="widgetCreator"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Widget Name"
          rules={[{ required: true, message: "Please enter a widget name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Template Description">
          <Input.TextArea
            disabled={true}
            value={selectedTemplate?.description || ""}
          />
        </Form.Item>
        <Form.Item name="description" label="User Description">
          <Input.TextArea
            placeholder="Enter a description for your widget"
            rows={3}
          />
        </Form.Item>
        <Form.Item
          name="campaign_id"
          label="Campaign"
          rules={[{ required: true, message: "Please select a campaign" }]}
        >
          {isCampaignsLoading ? (
            <Spin />
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
          name="widget_template_id"
          label="Widget Template"
          rules={[
            { required: true, message: "Please select a widget template" },
          ]}
        >
          {isTemplatesLoading || templates.length === 0 ? (
            <Spin />
          ) : (
            <Select onChange={handleSelectTemplate}>
              {templates.map((template) => (
                <Option key={template.id} value={template.id}>
                  {template.name} ({template.type})
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          name="config"
          label="Widget Configuration"
          rules={[
            { required: true, message: "Please enter widget configuration" },
            {
              validator: (_, value) => {
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject("Invalid JSON configuration");
                }
              },
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Widget
          </Button>
          <Button onClick={handleTestWidget} style={{ marginLeft: 8 }}>
            Test Widget
          </Button>
          <Button onClick={() => setIsCustomTemplateModalVisible(true)} style={{ marginLeft: 8 }}>
            Create Custom Template
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Test Widget"
        visible={isTestModalVisible}
        onCancel={handleTestModalCancel}
        footer={null}
        width={850}
      >
        <iframe
          srcDoc={testResult}
          style={{
            width: "100%",
            minWidth: "810px",
            height: "400px",
            padding: "auto",
            border: "none",
          }}
          sandbox="allow-scripts"
          title="Widget Preview"
        />
      </Modal>

      <Modal
        title="Create Custom Template"
        visible={isCustomTemplateModalVisible}
        onCancel={() => setIsCustomTemplateModalVisible(false)}
        footer={null}
        width={800}
      >
        <CustomTemplateCreator onTemplateCreated={handleCustomTemplateCreated} />
      </Modal>
    </>
  );
};

export default WidgetCreator;
