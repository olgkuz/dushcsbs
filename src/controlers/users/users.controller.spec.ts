import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../../services/users/users.service';
import { RegisterDto } from '../../dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    registerUser: jest.Mock;
    issueTokenFromUserObject: jest.Mock;
    getAllUsers: jest.Mock;
    getUserById: jest.Mock;
    deleteUsers: jest.Mock;
    deleteUserById: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      registerUser: jest.fn(),
      issueTokenFromUserObject: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      deleteUsers: jest.fn(),
      deleteUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('registers user through service', async () => {
    const dto = new RegisterDto();
    dto.name = 'john';
    dto.password = 'secret123';
    dto.email = 'john@example.com';

    await controller.register(dto);
    expect(usersService.registerUser).toHaveBeenCalledWith(dto);
  });

  it('fetches all users through service', async () => {
    await controller.getAllUsers();
    expect(usersService.getAllUsers).toHaveBeenCalledTimes(1);
  });

  it('fetches user by id', async () => {
    await controller.getUserById('id');
    expect(usersService.getUserById).toHaveBeenCalledWith('id');
  });

  it('deletes users through service', async () => {
    await controller.deleteUsers();
    expect(usersService.deleteUsers).toHaveBeenCalledTimes(1);
  });

  it('deletes user by id', async () => {
    await controller.deleteUserById('id');
    expect(usersService.deleteUserById).toHaveBeenCalledWith('id');
  });
});
