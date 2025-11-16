//con logs, borrar despues
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('🟡 [RolesGuard] Ruta sin restricción de roles → acceso permitido');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('🧠 [RolesGuard] Usuario del token:', user);
    console.log('🔑 [RolesGuard] Roles requeridos:', requiredRoles);

    const hasRole = user?.roles?.some((role: any) => requiredRoles.includes(role));

    if (!hasRole) {
      console.error('🚫 [RolesGuard] El usuario no tiene el rol necesario');
      throw new ForbiddenException('No tienes permiso para acceder a este recurso');
    }

    console.log('✅ [RolesGuard] Rol autorizado');
    return true;
  }
}
