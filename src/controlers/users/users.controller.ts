// src/controlers/users/users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RegisterDto } from '../../dto/user.dto';
import { UsersService } from '../../services/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../../services/authentication/local-auth.guard/local-auth.guard.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    name: string;
    email?: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.registerUser(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: AuthenticatedRequest) {
    const { id, name, email } = req.user; // �?�?�?�?���>����?�?���?�? �? LocalStrategy
    return this.usersService.issueTokenFromUserObject({ id, name, email });
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
