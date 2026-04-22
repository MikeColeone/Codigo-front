import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import type { TCurrentUser } from 'src/shared/helpers/current-user.helper';
import type { TComponentTypes } from '@codigo/schema';

type DraftComponent = {
  type: TComponentTypes;
  props?: Record<string, unknown>;
  styles?: Record<string, unknown>;
};

type AiChatStreamRequest = {
  prompt: string;
  current?: Array<{
    id: string;
    type: string;
    props?: Record<string, unknown>;
    styles?: Record<string, unknown>;
  }>;
  page?: {
    id: string;
    path: string;
    name: string;
  };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseOptions(prompt: string) {
  const matched = prompt.match(/选项[:：]\s*([^\n。；;]+)/);
  if (!matched) return [];
  return matched[1]
    .split(/[、,，/|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildRadioDraft(title: string, options: string[]): DraftComponent {
  const normalizedOptions = options.length > 0 ? options : ['选项1', '选项2'];
  const mappedOptions = normalizedOptions.map((value) => ({
    id: randomUUID(),
    value,
  }));

  return {
    type: 'radio',
    props: {
      id: randomUUID(),
      title,
      options: mappedOptions,
      defaultRadio: mappedOptions[0]?.id ?? '',
    },
  };
}

function buildCheckboxDraft(title: string, options: string[]): DraftComponent {
  const normalizedOptions = options.length > 0 ? options : ['选项1', '选项2'];
  const mappedOptions = normalizedOptions.map((value) => ({
    id: randomUUID(),
    value,
  }));

  return {
    type: 'checkbox',
    props: {
      id: randomUUID(),
      title,
      options: mappedOptions,
      defaultChecked: mappedOptions[0] ? [mappedOptions[0].id] : [],
    },
  };
}

function buildDraftByPrompt(prompt: string): DraftComponent[] {
  const next: DraftComponent[] = [];
  const options = parseOptions(prompt);
  const titleMatch = prompt.match(/标题[:：]?\s*([^\n，。；;]+)/);
  const pageTitle = titleMatch?.[1]?.trim();
  const normalized = prompt.toLowerCase();

  if (pageTitle) {
    next.push({
      type: 'titleText',
      props: {
        title: pageTitle,
        size: 'xl',
      },
    });
  }

  if (prompt.includes('图片') || prompt.includes('banner')) {
    next.push({
      type: 'image',
      props: {
        name: '主图',
        height: 220,
      },
    });
  }

  if (prompt.includes('注意') || prompt.includes('提示') || prompt.includes('警告')) {
    next.push({
      type: 'alert',
      props: {
        title: '请根据页面提示完成填写',
        showIcon: true,
        showClose: false,
        type: 'info',
      },
    });
  }

  const inputConfigs = [
    { keyword: '姓名', title: '姓名', placeholder: '请输入姓名' },
    { keyword: '手机号', title: '手机号', placeholder: '请输入手机号' },
    { keyword: '电话', title: '联系电话', placeholder: '请输入联系电话' },
    { keyword: '邮箱', title: '邮箱', placeholder: '请输入邮箱' },
    { keyword: '公司', title: '公司名称', placeholder: '请输入公司名称' },
  ];

  for (const config of inputConfigs) {
    if (!prompt.includes(config.keyword)) continue;
    next.push({
      type: 'input',
      props: {
        title: config.title,
        placeholder: config.placeholder,
        text: '',
      },
    });
  }

  if (
    prompt.includes('描述') ||
    prompt.includes('留言') ||
    prompt.includes('建议') ||
    prompt.includes('备注')
  ) {
    next.push({
      type: 'textArea',
      props: {
        title: '详细描述',
        placeholder: '请输入详细描述',
        text: '',
      },
    });
  }

  if (prompt.includes('单选') || prompt.includes('radio') || prompt.includes('选择一项')) {
    next.push(buildRadioDraft('请选择一项', options));
  }

  if (prompt.includes('多选') || prompt.includes('checkbox')) {
    next.push(buildCheckboxDraft('可多选', options));
  }

  if (prompt.includes('分割') || prompt.includes('分隔')) {
    next.push({
      type: 'split',
      props: {},
    });
  }

  if (normalized.includes('问卷') || normalized.includes('表单')) {
    if (!next.some((item) => item.type === 'titleText')) {
      next.unshift({
        type: 'titleText',
        props: {
          title: '问卷信息收集',
          size: 'lg',
        },
      });
    }
    if (!next.some((item) => item.type === 'input')) {
      next.push({
        type: 'input',
        props: {
          title: '姓名',
          placeholder: '请输入姓名',
          text: '',
        },
      });
    }
  }

  if (next.length === 0) {
    next.push(
      {
        type: 'titleText',
        props: {
          title: 'AI 生成页面',
          size: 'lg',
        },
      },
      {
        type: 'input',
        props: {
          title: '输入项',
          placeholder: '请输入',
          text: '',
        },
      },
    );
  }

  return next;
}

@Injectable()
export class AiChatService {
  private writeEvent(res: Response, event: string, data: unknown) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  private buildGenerationSystemPrompt(args: {
    page?: AiChatStreamRequest['page'];
    current?: AiChatStreamRequest['current'];
  }) {
    const allowedTypes = [
      'titleText',
      'image',
      'alert',
      'input',
      'textArea',
      'radio',
      'checkbox',
      'list',
      'split',
    ];

    const currentTypes = Array.from(
      new Set((args.current ?? []).map((item) => item?.type).filter(Boolean)),
    ).slice(0, 32);

    const currentSamples = (args.current ?? [])
      .filter((item) => item && typeof item === 'object')
      .slice(0, 8)
      .map((item) => ({
        type: item.type,
        props:
          item.props && typeof item.props === 'object'
            ? Object.fromEntries(Object.entries(item.props).slice(0, 10))
            : undefined,
        styles:
          item.styles && typeof item.styles === 'object'
            ? Object.fromEntries(Object.entries(item.styles).slice(0, 10))
            : undefined,
      }));

    const componentCheatSheet = {
      titleText: { props: { title: '页面标题', size: 'lg' } },
      image: { props: { name: '主图', height: 220 } },
      alert: {
        props: { title: '提示信息', showIcon: true, showClose: false, type: 'info' },
      },
      input: { props: { title: '姓名', placeholder: '请输入姓名', text: '' } },
      textArea: { props: { title: '备注', placeholder: '请输入', text: '' } },
      radio: {
        props: {
          id: 'uuid',
          title: '请选择一项',
          options: [{ id: 'uuid', value: '选项1' }],
          defaultRadio: 'uuid',
        },
      },
      checkbox: {
        props: {
          id: 'uuid',
          title: '可多选',
          options: [{ id: 'uuid', value: '选项1' }],
          defaultChecked: ['uuid'],
        },
      },
      list: {
        props: {
          items: [
            {
              id: 'uuid',
              title: '列表项1',
              description: '这是列表说明',
              titleLink: 'https://example.com',
              avatar: 'https://example.com/50x50.png',
            },
          ],
        },
      },
      split: { props: {} },
    };

    const pageHint = args.page
      ? `当前页面：${args.page.name}（path=${args.page.path}）`
      : '当前页面：未提供';

    return (
      '你是一个低代码页面组件生成器。' +
      '你的任务是根据用户描述，生成可直接用于渲染的组件草稿 JSON。' +
      '\n' +
      pageHint +
      '\n' +
      `可用组件 type 白名单：${allowedTypes.join(', ')}。禁止输出白名单以外的 type。` +
      '\n' +
      '只输出严格 JSON，不要 Markdown，不要解释，不要多余文本。' +
      '\n' +
      '输出格式必须为：{"draft":[{"type":"...","props":{...},"styles":{...}},...]}' +
      '\n' +
      'props/styles 必须可 JSON 序列化；styles 仅用于布局/样式，可省略。' +
      '\n' +
      '如需生成 radio/checkbox，请务必包含 id/options/defaultRadio(defaultChecked)。' +
      '\n' +
      `当前画布已有组件类型（供参考）：${JSON.stringify(currentTypes)}` +
      '\n' +
      `当前画布组件样例（供参考）：${JSON.stringify(currentSamples)}` +
      '\n' +
      `组件 props 样例（严格参考字段名）：${JSON.stringify(componentCheatSheet)}`
    );
  }

  private async streamFromDeepSeek({
    prompt,
    req,
    res,
    page,
    current,
  }: {
    prompt: string;
    req: Request;
    res: Response;
    page?: AiChatStreamRequest['page'];
    current?: AiChatStreamRequest['current'];
  }): Promise<{ draft: DraftComponent[]; rawText: string }> {
    const apiKey =
      process.env.DEEPSEEK_API_KEY ||
      process.env.DEEPSEEK_APIKEY ||
      process.env.DEEPSEEK_KEY;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY 未配置');
    }

    const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com')
      .trim()
      .replace(/\/+$/, '');
    const model = (process.env.DEEPSEEK_MODEL || 'deepseek-chat').trim();
    const endpoint = `${baseUrl}/chat/completions`;

    const systemPrompt = this.buildGenerationSystemPrompt({ page, current });

    const body = {
      model,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    };

    const controller = new AbortController();
    const onClose = () => controller.abort();
    req.on('close', onClose);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || `DeepSeek 请求失败：${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('DeepSeek 响应不支持流式读取');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let rawText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        const lines = part
          .split('\n')
          .map((line) => line.replace(/\r$/, ''))
          .filter(Boolean);
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          if (payload === '[DONE]') {
            break;
          }
          try {
            const json = JSON.parse(payload) as any;
            const delta = json?.choices?.[0]?.delta?.content;
            if (typeof delta === 'string' && delta.length > 0) {
              rawText += delta;
              this.writeEvent(res, 'delta', { text: delta });
            }
          } catch {
            continue;
          }
        }
      }
    }

    req.off('close', onClose);

    const extracted = this.tryParseDraftFromModelText(rawText);
    if (extracted) {
      return { draft: extracted, rawText };
    }

    const fallback = buildDraftByPrompt(prompt);
    return { draft: fallback, rawText };
  }

  private tryParseDraftFromModelText(text: string): DraftComponent[] | null {
    const trimmed = text.trim();
    const unfenced = trimmed
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    const first = unfenced.indexOf('{');
    const last = unfenced.lastIndexOf('}');
    if (first < 0 || last <= first) return null;

    const slice = unfenced.slice(first, last + 1);
    try {
      const parsed = JSON.parse(slice) as { draft?: unknown };
      const draft = parsed?.draft;
      if (!Array.isArray(draft)) return null;
      const normalized = draft
        .filter((item) => item && typeof item === 'object')
        .map((item) => item as any)
        .map((item) => ({
          type: item.type,
          props:
            item.props && typeof item.props === 'object' ? (item.props as any) : undefined,
          styles:
            item.styles && typeof item.styles === 'object'
              ? (item.styles as any)
              : undefined,
        }))
        .filter((item) => typeof item.type === 'string');
      return normalized as DraftComponent[];
    } catch {
      return null;
    }
  }

  async streamChat({
    body,
    req,
    res,
    user,
  }: {
    body: AiChatStreamRequest;
    req: Request;
    res: Response;
    user: TCurrentUser;
  }) {
    const prompt = body?.prompt?.trim() ?? '';
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    (res as any).flushHeaders?.();

    let closed = false;
    req.on('close', () => {
      closed = true;
    });

    try {
      if (!prompt) {
        this.writeEvent(res, 'error', { message: 'prompt 不能为空' });
        res.end();
        return;
      }

      this.writeEvent(res, 'meta', { requestId: randomUUID(), userId: user.id });
      const hasDeepSeek = Boolean(
        process.env.DEEPSEEK_API_KEY ||
          process.env.DEEPSEEK_APIKEY ||
          process.env.DEEPSEEK_KEY,
      );
      if (!hasDeepSeek) {
        this.writeEvent(res, 'delta', {
          text: '未检测到 DEEPSEEK_API_KEY，使用本地规则生成（demo）。\n',
        });
        await sleep(120);
        const draft = buildDraftByPrompt(prompt);
        this.writeEvent(res, 'result', { draft });
        this.writeEvent(res, 'done', {});
        res.end();
        return;
      }

      this.writeEvent(res, 'delta', { text: '已连接 DeepSeek，开始生成...\n' });
      if (closed) return;

      const { draft } = await this.streamFromDeepSeek({
        prompt,
        req,
        res,
        page: body.page,
        current: body.current,
      });
      if (closed) return;

      this.writeEvent(res, 'result', { draft });
      this.writeEvent(res, 'done', {});
      res.end();
    } catch (error) {
      if (!res.headersSent) {
        res.status(500);
      }
      this.writeEvent(res, 'error', {
        message: (error as Error).message ?? 'unknown error',
      });
      res.end();
    }
  }
}
