import { Strategy } from "passport-local";
import { PassportStrategy} from '@nestjs/passport';
import { HttpException,HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../users/users.service";
@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService,
                private jwtServuce: JwtService
    ) {
        super({usernameField:'login', passwordField:'password'});
    }


async validate(login:string,password:string): Promise<any>{
    const user = await this.userService.checkAuthUser(login,password);
   
    if (!user) {
        throw new HttpException({
            status:HttpStatus.CONFLICT,
            errorText:' Пользователь не найден в базе ',
    },HttpStatus.CONFLICT);
    }
    return true;
}

}