import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from '@app/services/cards/cards.service';
import type { Express } from 'express';
import { Readable } from 'stream';

describe('CardsController', () => {
  let controller: CardsController;
  let cardsService: {
    getCards: jest.Mock;
    getCardById: jest.Mock;
    uploadCard: jest.Mock;
    deleteCardById: jest.Mock;
  };

  beforeEach(async () => {
    cardsService = {
      getCards: jest.fn().mockResolvedValue([]),
      getCardById: jest.fn(),
      uploadCard: jest.fn(),
      deleteCardById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [{ provide: CardsService, useValue: cardsService }],
    }).compile();

    controller = module.get<CardsController>(CardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns cards list via service', async () => {
    await controller.getAllCards();
    expect(cardsService.getCards).toHaveBeenCalledTimes(1);
  });

  it('fetches card by id', async () => {
    await controller.getCardById('abc');
    expect(cardsService.getCardById).toHaveBeenCalledWith('abc');
  });

  it('passes upload payload to service', async () => {
    const file: Express.Multer.File = {
      fieldname: 'img',
      originalname: 'file.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 123,
      stream: Readable.from([]),
      destination: 'public',
      filename: 'file.png',
      path: 'public/file.png',
      buffer: Buffer.from([]),
    };

    await controller.uploadCard(file, {
      name: 'A',
      description: 'B',
    });
    expect(cardsService.uploadCard).toHaveBeenCalledWith({
      name: 'A',
      description: 'B',
      img: 'file.png',
    });
  });

  it('deletes card via service', async () => {
    await controller.deleteCard('qwe');
    expect(cardsService.deleteCardById).toHaveBeenCalledWith('qwe');
  });
});
