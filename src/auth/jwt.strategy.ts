import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
       secretOrKey: process.env.JWT_SECRET || 'default_secret', // Usualmente viene de .env
    });
  }

  async validate(payload: any) {
    // Este método se llama si el token es válido
    return { userId: payload.sub, username: payload.username };
  }
}
