import { Controller, Post, Body, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { AuthDto, RegisterDto } from '../../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../../services/authentication/local-auth.guard/local-auth.guard.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.registerUser(registerDto);
  }

  @UseGuards(LocalAuthGuard) // ✅ см. LocalStrategy ниже
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

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteUsers() {
    return this.usersService.deleteUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
