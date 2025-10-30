import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from '@app/services/mail/mail.service';

describe('MailController', () => {
  let controller: MailController;
  let mailService: { sendContactMail: jest.Mock };

  beforeEach(async () => {
    mailService = {
      sendContactMail: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [{ provide: MailService, useValue: mailService }],
    }).compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates contact form handling to MailService', async () => {
    await controller.handleContact({
      name: 'John',
      phone: '+70000000000',
      message: 'Hello',
    });
    expect(mailService.sendContactMail).toHaveBeenCalledWith(
      'John',
      '+70000000000',
      'Hello',
    );
  });
});
