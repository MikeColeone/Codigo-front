import { Space, Tag, Typography } from "antd";
import { useMemo } from "react";
import { getDefaultValueByConfig } from "..";
import {
  type IPageHeaderComponentProps,
  pageHeaderComponentDefaultConfig,
} from ".";

const { Title, Text } = Typography;

function parseTags(tagsText: string) {
  return tagsText
    .split(/[、,，|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PageHeaderComponent(_props: IPageHeaderComponentProps) {
  const props = useMemo(() => {
    return {
      ...getDefaultValueByConfig(pageHeaderComponentDefaultConfig),
      ..._props,
    };
  }, [_props]);

  const tags = parseTags(props.tagsText);

  return (
    <div
      style={{
        borderRadius: 20,
        background: "#ffffff",
        padding: 24,
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Space direction="vertical" size={6}>
          <Title level={3} style={{ margin: 0 }}>
            {props.title}
          </Title>
          <Text type="secondary">{props.subtitle}</Text>
          {!!tags.length && (
            <Space wrap>
              {tags.map((tag) => (
                <Tag key={tag} color="blue">
                  {tag}
                </Tag>
              ))}
            </Space>
          )}
        </Space>

        <Text type="secondary">{props.extraText}</Text>
      </div>
    </div>
  );
}
