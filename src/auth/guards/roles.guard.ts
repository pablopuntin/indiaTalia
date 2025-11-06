import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1️⃣ Obtener los roles requeridos desde los metadatos
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene roles definidos, dejar pasar
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 2️⃣ Obtener el usuario del request (lo agregó el JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 3️⃣ Validar si el usuario tiene alguno de los roles requeridos
    const hasRole = user?.roles?.some((role: any) => requiredRoles.includes(role.name || role));

    if (!hasRole) {
      throw new ForbiddenException('No tines permiso para acceder aeste recurso');
    }

    return true;
  }
}
