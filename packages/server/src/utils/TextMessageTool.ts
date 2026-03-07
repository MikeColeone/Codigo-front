import { Injectable } from '@nestjs/common';
import { TextMessageConfig } from 'config';

/**
 * 短信发送装饰器
 */

@Injectable()
export class TextMessageTool {
  async sendTextMessage(phone: string, randomCode: number): Promise<any> {
    const url = new URL('https://jmsms.market.alicloudapi.com/sms/send');

    url.searchParams.append('mobile', phone);
    url.searchParams.append('templateId', 'JM1000372');
    url.searchParams.append('value', randomCode.toString());

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `APPCODE ${TextMessageConfig.AppCode}`,
      },
    });

    return response.json();
  }
}
