import { IsString, IsEmail, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  login: string = '';

  @IsNotEmpty()
  @IsString()
  password: string = '';
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  login: string = '';

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string = '';

  @IsOptional()
  @IsEmail()
  email?: string = '';
}

export interface UserResponseDto {
  id: string;
  login: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}