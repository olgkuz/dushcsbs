import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { getModelToken } from '@nestjs/mongoose';
import { Card, CardDocument } from 'src/schemas/card.shema';
import type { Model } from 'mongoose';

class CardModelMock {
  static calls: Array<{ name: string; description: string; img?: string }> = [];

  constructor(
    private readonly dto: { name: string; description: string; img?: string },
  ) {
    CardModelMock.calls.push(dto);
  }

  save(): Promise<{
    name: string;
    description: string;
    img?: string;
    id: string;
  }> {
    return Promise.resolve({ ...this.dto, id: '1' });
  }
}

describe('CardsService', () => {
  let service: CardsService;

  beforeEach(async () => {
    CardModelMock.calls = [];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getModelToken(Card.name),
          useValue: CardModelMock as unknown as Model<CardDocument>,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a card via model', async () => {
    const payload = { name: 'N', description: 'D' };

    const result = await service.uploadCard(payload);

    expect(CardModelMock.calls).toEqual([payload]);
    expect(result).toEqual({ ...payload, id: '1' });
  });
});
