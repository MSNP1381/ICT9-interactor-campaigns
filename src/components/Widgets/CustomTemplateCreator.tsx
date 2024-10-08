import React, { useState } from "react";
import { Form, Input, Button, message, Select, Spin } from "antd";
import { createWidgetTemplate, WidgetTemplate, createGenAIReq } from "../../api/widgetTemplates";
// import { duration } from "moment";
// import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const widgetTypes = ['game', 'survey', 'quiz', 'form' , 'calculator']; // Add or modify types as needed


interface CustomTemplateCreatorProps {
  onTemplateCreated: (template: WidgetTemplate) => void;
}


const CustomTemplateCreator: React.FC<CustomTemplateCreatorProps> = ({ onTemplateCreated }) => {
  const [form] = Form.useForm();
  const [customTemplate, setCustomTemplate] = useState<string>("");
  const [extractedVariables, setExtractedVariables] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleCustomTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomTemplate(e.target.value);
  };

  const handleAiPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };

  const extractVariables = () => {
    const variables = new Set<string>();
    const regex = /\{\{\s*(\w+)\s*\}\}/g;
    let match;

    while ((match = regex.exec(customTemplate)) !== null) {
      variables.add(match[1]);
    }

    setExtractedVariables(Array.from(variables));
  };

  const generateTemplateWithAI = async () => {
    setIsGenerating(true);
    try {
      const response = await createGenAIReq({ 'prompt': aiPrompt });
      setCustomTemplate(response.template);
      message.success("Template generated successfully");
    } catch (error) {
      console.error("Error generating template with AI:", error);
      message.error("Failed to generate template with AI");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCustomTemplate = async () => {
    try {
      const values = await form.validateFields();
      const newTemplate: Omit<WidgetTemplate, "id"> = {
        name: values.name,
        description: values.description,
        type: values.widget_type,
        template: customTemplate,
        config: extractedVariables.reduce((acc, variable) => {
          acc[variable] = "";
          return acc;
        }, {} as Record<string, string>),
        host_id: localStorage.getItem("defaultHostId") ?? "",
      };

      const createdTemplate = await createWidgetTemplate(newTemplate);
      message.success("Custom template created successfully");
      onTemplateCreated(createdTemplate);
    } catch (error: any) {
        if (error.status===400){
            console.log(error);
            message.error("template is not safe ");
        } else {
            message.error("Failed to create custom template: " + error.response.data.detail, 5);
        }
      console.error("Error creating custom template:", error);
      message.error("Failed to create custom template");

    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleCreateCustomTemplate}>
      <Form.Item
        name="name"
        label="Template Name"
        rules={[{ required: true, message: "Please enter a template name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Template Description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item label="Custom Template">
        <TextArea
          rows={10}
          value={customTemplate}
          onChange={handleCustomTemplateChange}
          placeholder="Enter your custom Jinja2 template here"
        />
      </Form.Item>
      <Form.Item label="Generate with AI">
        <TextArea
          rows={3}
          value={aiPrompt}
          onChange={handleAiPromptChange}
          placeholder="Enter a prompt for AI-generated template"
        />
        <Spin spinning={isGenerating}>
          <Button onClick={generateTemplateWithAI} style={{ marginTop: 8 }} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Template"}
          </Button>
        </Spin>
      </Form.Item>
      <Form.Item
        name="widget_type"
        label="Widget Type"
        rules={[{ required: true, message: "Please select a widget type" }]}
      >
        <Select>
          {widgetTypes.map((type) => (
            <Option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button onClick={extractVariables} style={{ marginRight: 8 }}>
          Extract Variables
        </Button>
        <Button type="primary" htmlType="submit">
          Create Template
        </Button>
      </Form.Item>
      {extractedVariables.length > 0 && (
        <Form.Item label="Extracted Variables">
          <ul>
            {extractedVariables.map((variable, index) => (
              <li key={index}>{variable}</li>
            ))}
          </ul>
        </Form.Item>
      )}
    </Form>
  );
};

export default CustomTemplateCreator;