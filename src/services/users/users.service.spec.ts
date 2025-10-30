import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../schemas/user.shema';

describe('UsersService', () => {
  let service: UsersService;
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: JwtService, useValue: jwtService },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('issues token using JwtService', () => {
    const result = service.issueTokenFromUserObject({
      id: '1',
      name: 'Alice',
      email: 'a@example.com',
    });
    expect(jwtService.sign).toHaveBeenCalledWith({
      name: 'Alice',
      sub: '1',
      email: 'a@example.com',
    });
    expect(result).toEqual({
      token: 'signed-token',
      user: {
        id: '1',
        name: 'Alice',
        email: 'a@example.com',
      },
    });
  });
});
