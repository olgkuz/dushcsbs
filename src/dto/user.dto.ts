export class UserDto {
  password: string;
  login: string;
  email?: string;
}

export class AuthDto {
  login: string;
  password: string;
}

export class RegisterDto {
  login: string;
  password: string;
  email?: string;
}