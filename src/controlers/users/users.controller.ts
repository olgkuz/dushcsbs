import { Controller, Post, Body, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { AuthDto, RegisterDto } from '../../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '@app/services/authentication/local-auth.guard/local-auth.guard.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.registerUser(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return this.usersService.login(authDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Delete()
  async deleteUsers() {
    return this.usersService.deleteUsers();
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}