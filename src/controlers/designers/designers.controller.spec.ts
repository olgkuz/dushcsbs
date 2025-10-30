import { Test, TestingModule } from '@nestjs/testing';
import { DesignersController } from './designers.controller';
import { MailService } from '@app/services/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import type { Express } from 'express';
import { Readable } from 'stream';

describe('DesignersController', () => {
  let controller: DesignersController;
  let mailService: { sendDesignerAssignment: jest.Mock };
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    mailService = {
      sendDesignerAssignment: jest.fn().mockResolvedValue(undefined),
    };
    configService = {
      get: jest.fn().mockReturnValue('receiver@example.com'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignersController],
      providers: [
        { provide: MailService, useValue: mailService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    controller = module.get<DesignersController>(DesignersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sends assignment email via MailService', async () => {
    type UploadRequest = Parameters<
      DesignersController['handleDesignerUpload']
    >[4];
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'name.dwg',
      encoding: '7bit',
      mimetype: 'application/octet-stream',
      size: 256,
      stream: Readable.from([]),
      destination: 'uploads',
      filename: 'name.dwg',
      path: 'uploads/name.dwg',
      buffer: Buffer.from([]),
    };
    const req: UploadRequest = {
      user: { email: 'user@example.com' },
    } as UploadRequest;

    await controller.handleDesignerUpload(
      file,
      'Object',
      '+79998887766',
      'Comment',
      req,
    );

    expect(mailService.sendDesignerAssignment).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'receiver@example.com',
        objectName: 'Object',
        phone: '+79998887766',
      }),
    );
  });
});
