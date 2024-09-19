import React from "react";
import { Card, Typography } from "antd";
import nunjucks from "nunjucks";

const { Title, Paragraph } = Typography;

interface WidgetTemplateProps {
  name: string;
  type: string;
  description: string;
  template: string;
  onSelect: () => void;
}

const WidgetTemplate: React.FC<WidgetTemplateProps> = ({
  name,
  type,
  description,
  template,
  onSelect,
}) => {
  const renderTemplate = () => {
    const env = new nunjucks.Environment();
    return { __html: env.renderString(template, {}) };
  };

  return (
    <Card hoverable onClick={onSelect} style={{ height: "100%" }}>
      <Title level={4}>{name}</Title>
      <Paragraph strong>Type: {type}</Paragraph>
      <Paragraph>{description}</Paragraph>
      <div dangerouslySetInnerHTML={renderTemplate()} />
    </Card>
  );
};

export default WidgetTemplate;
