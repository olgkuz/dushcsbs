import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

describe('MailService', () => {
  let service: MailService;
  let mailer: { sendMail: jest.Mock };
  let config: { get: jest.Mock };

  beforeEach(async () => {
    mailer = {
      sendMail: jest.fn().mockResolvedValue({ rejected: [] }),
    };
    config = {
      get: jest.fn((key: string) => {
        if (key === 'RECEIVER_EMAIL') return 'to@example.com';
        if (key === 'MAIL_USER') return 'from@example.com';
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mailer },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sends contact mail with provided data', async () => {
    await service.sendContactMail('Alice', '123', 'Hi');
    expect(mailer.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'to@example.com',
        from: '"ShowerGlass" <from@example.com>',
        replyTo: undefined,
        text: expect.stringContaining('Phone/Email: 123'),
      }),
    );
  });

  it('handles missing phone without throwing', async () => {
    await expect(service.sendContactMail('Bob', undefined, 'Hi there')).resolves.toBeUndefined();
    expect(mailer.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: undefined,
        text: expect.stringContaining('Phone/Email: -'),
      }),
    );
  });
});
