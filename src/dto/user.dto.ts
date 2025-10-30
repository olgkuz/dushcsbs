import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  name: string = ''; // было login

  @IsNotEmpty()
  @IsString()
  password: string = '';
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string = ''; // было login

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
  name: string; // было login
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
