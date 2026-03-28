import { AuthController } from 'src/modules/user/controller/auth.controller';
import { UserController } from 'src/modules/user/controller/user.controller';

describe('captcha controllers', () => {
  const key = 'secret-key';
  const ip = '127.0.0.1';
  const agent = 'jest-agent';
  const type = 'register';
  const captchaResponse = { data: '<svg />', text: 'ABCD' };

  const userService = {
    getCaptcha: jest.fn(),
  };

  const secretTool = {
    getSecret: jest.fn(),
  };

  const randomTool = {
    randomCode: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    secretTool.getSecret.mockReturnValue(key);
    userService.getCaptcha.mockResolvedValue(captchaResponse);
  });

  it('passes key before type in auth captcha endpoint', async () => {
    const controller = new AuthController(
      userService as never,
      secretTool as never,
      randomTool as never,
    );

    const result = await controller.getCaptcha({ type }, ip, agent);

    expect(secretTool.getSecret).toHaveBeenCalledWith(ip + agent);
    expect(userService.getCaptcha).toHaveBeenCalledWith(key, type);
    expect(result).toBe(captchaResponse);
  });

  it('passes key before type in legacy user captcha endpoint', async () => {
    const controller = new UserController(
      userService as never,
      secretTool as never,
      randomTool as never,
    );

    const result = await controller.getCaptcha({ type }, ip, agent);

    expect(secretTool.getSecret).toHaveBeenCalledWith(ip + agent);
    expect(userService.getCaptcha).toHaveBeenCalledWith(key, type);
    expect(result).toBe(captchaResponse);
  });
});
