import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local-strategy.service';
import {
  UsersService,
  AuthenticatedUserPayload,
} from '../../users/users.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let usersService: {
    checkAuthUser: jest.Mock<
      Promise<AuthenticatedUserPayload>,
      [string, string]
    >;
  };

  beforeEach(async () => {
    const checkAuthUser = jest.fn<
      Promise<AuthenticatedUserPayload>,
      [string, string]
    >();
    checkAuthUser.mockResolvedValue({
      id: '123',
      name: 'Alice',
      email: 'alice@example.com',
    });

    usersService = {
      checkAuthUser,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('validates user via UsersService and maps fields', async () => {
    const result = await strategy.validate('alice', 'secret');
    expect(usersService.checkAuthUser).toHaveBeenCalledWith('alice', 'secret');
    expect(result).toEqual({
      id: '123',
      name: 'Alice',
      email: 'alice@example.com',
    });
  });
});
