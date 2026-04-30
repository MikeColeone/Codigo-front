import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  buildExpireSummary,
  DEFAULT_PUBLISH_RELEASE_VALUES,
  type PublishReleaseModalValues,
} from "./publish-release-modal.config";

interface PublishReleaseModalProps {
  open: boolean;
  loading?: boolean;
  shareUrl: string;
  pageName: string;
  onSubmit: (values: PublishReleaseModalValues) => Promise<void>;
  onCancel: () => void;
}

/**
 * 展示发布成功后的分享结果，并预留过期时间与权限配置入口。
 */
export function PublishReleaseModal({
  open,
  loading = false,
  shareUrl,
  pageName,
  onSubmit,
  onCancel,
}: PublishReleaseModalProps) {
  const [form] = Form.useForm<PublishReleaseModalValues>();
  const expirePreset =
    Form.useWatch("expirePreset", form) ?? DEFAULT_PUBLISH_RELEASE_VALUES.expirePreset;
  const expireAt = Form.useWatch("expireAt", form) ?? null;
  const visibility =
    Form.useWatch("visibility", form) ?? DEFAULT_PUBLISH_RELEASE_VALUES.visibility;

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    form.setFieldsValue(DEFAULT_PUBLISH_RELEASE_VALUES);
  }, [form, open, shareUrl]);

  const expireSummary = useMemo(() => {
    return buildExpireSummary({ expireAt, expirePreset, visibility });
  }, [expireAt, expirePreset, visibility]);

  /**
   * 复制当前发布链接。
   */
  async function handleCopyLink() {
    const fallbackCopy = () => {
      window.prompt("复制发布链接", shareUrl);
    };

    try {
      if (!navigator?.clipboard?.writeText) {
        fallbackCopy();
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      message.success("已复制发布链接");
    } catch {
      fallbackCopy();
    }
  }

  /**
   * 在新标签页打开已发布链接。
   */
  function handleOpenLink() {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  /**
   * 提交当前发布配置。
   */
  async function handleSubmit() {
    const values = await form.validateFields();
    await onSubmit(values);
  }

  return (
    <Modal
      open={open}
      title="发布成功"
      onCancel={onCancel}
      confirmLoading={loading}
      footer={
        <Space size={8}>
          <Button onClick={handleCopyLink}>复制链接</Button>
          <Button onClick={handleOpenLink}>打开链接</Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            完成
          </Button>
        </Space>
      }
      width={680}
      destroyOnHidden
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Typography.Title level={5} className="!mb-1 !text-slate-900">
                {pageName || "未命名应用"}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !text-sm !text-slate-600">
                当前发布链接固定不变，再次发布会覆盖线上内容，但分享地址保持一致。
              </Typography.Paragraph>
            </div>
            <Tag color="green" className="!mr-0">
              已发布
            </Tag>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={DEFAULT_PUBLISH_RELEASE_VALUES}
        >
          <Form.Item label="公开链接">
            <Input.TextArea value={shareUrl} readOnly autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item label="访问权限" name="visibility">
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                options={[
                  { label: "公开访问", value: "public" },
                  { label: "私密访问", value: "private" },
                ]}
              />
            </Form.Item>

            <Form.Item label="过期策略" name="expirePreset">
              <Select
                options={[
                  { label: "永久有效", value: "never" },
                  { label: "7 天后过期", value: "7d" },
                  { label: "30 天后过期", value: "30d" },
                  { label: "自定义时间", value: "custom" },
                ]}
              />
            </Form.Item>
          </div>

          {expirePreset === "custom" ? (
            <Form.Item
              label="自定义过期时间"
              name="expireAt"
              rules={[{ required: true, message: "请选择过期时间" }]}
            >
              <DatePicker
                showTime
                className="w-full"
                placeholder="选择链接失效时间"
                disabledDate={(current) =>
                  Boolean(current && current.endOf("day").isBefore(dayjs()))
                }
              />
            </Form.Item>
          ) : null}
        </Form>

        <Alert
          type="info"
          showIcon
          message="访问说明"
          description={`当前状态：${expireSummary}；公开访问可直接打开链接，私密访问仅允许发布者登录后访问。`}
        />
      </div>
    </Modal>
  );
}
