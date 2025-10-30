import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstant } from '../../../static/privte/constants';

type JwtPayload = {
  sub: string; // user id
  name: string; // user display name
  email?: string; // optional email embedded in the token
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

  validate(payload: JwtPayload) {
    // value that becomes available as req.user
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email, // can be undefined if omitted from payload
    };
  }
}
