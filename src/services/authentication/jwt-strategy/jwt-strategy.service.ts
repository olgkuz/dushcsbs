import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstant } from '../../../static/privte/constants';

type JwtPayload = {
  sub: string;      // id пользователя
  name: string;     // имя пользователя
  email?: string;   // опционально, если положим в payload
};

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.secret,
    });
  }

  async validate(payload: JwtPayload) {
    // Это попадёт в req.user
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email, // будет undefined, если не положим в payload
    };
  }
}


