import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthSwagger } from './decorators/auth-swagger.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){} 

    @AuthSwagger()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin')
    @Post('register')
    @ApiOperation({summary: 'registro de usuarios'})
    @ApiBody({type: RegisterDto})
    async register(@Body() registerDto: RegisterDto) {
       return this.authService.register(registerDto);
}


@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}

}
