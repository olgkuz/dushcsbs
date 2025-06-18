import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../services/users/users.service';
import { AuthDto, RegisterDto } from '../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post('register')
  async registerUser(@Body() data: RegisterDto) {
    const user = await this.userService.registerUser(data);
    return {
      success: true,
      user: {
        login: user.login,
        email: user.email,
        _id: user._id
      }
    };
  }

  @Post('login')
  async authUser(@Body() data: AuthDto) {
    const { user, token } = await this.userService.login(data);
    return {
      success: true,
      token,
      user: {
        login: user.login,
        email: user.email,
        _id: user._id
      }
    };
  }

  @Delete()
  deleteUsers() {
    return this.userService.deleteUsers();
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}