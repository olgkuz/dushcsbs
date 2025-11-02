import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategyService } from './jwt-strategy.service';

describe('JwtStrategyService', () => {
  let service: JwtStrategyService;
  const configMock = {
    get: jest.fn((key: string) => (key === 'JWT_SECRET' ? 'test-secret' : undefined)),
  };

  beforeEach(async () => {
    configMock.get.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategyService,
        {
          provide: ConfigService,
          useValue: configMock,
        },
      ],
    }).compile();

    service = module.get<JwtStrategyService>(JwtStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose payload data via validate', () => {
    const payload = { sub: '123', name: 'Demo User', email: 'demo@example.com' };

    expect(service.validate(payload)).toEqual({
      id: '123',
      name: 'Demo User',
      email: 'demo@example.com',
    });
  });
});
