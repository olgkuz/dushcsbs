import { Test, TestingModule } from '@nestjs/testing';
import { DesignersController } from './designers.controller';

describe('DesignersController', () => {
  let controller: DesignersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignersController],
    }).compile();

    controller = module.get<DesignersController>(DesignersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
