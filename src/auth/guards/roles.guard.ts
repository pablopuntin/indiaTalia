// import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../decorators/roles.decorator';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     // 1️⃣ Obtener los roles requeridos desde los metadatos
//     const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     // Si la ruta no tiene roles definidos, dejar pasar
//     if (!requiredRoles || requiredRoles.length === 0) {
//       return true;
//     }

//     // 2️⃣ Obtener el usuario del request (lo agregó el JwtStrategy)
//     const { user } = context.switchToHttp().getRequest();
//     console.log('🧠 User from token:', user);
// console.log('🔑 Required roles:', requiredRoles);

//     // 3️⃣ Validar si el usuario tiene alguno de los roles requeridos
//     const hasRole = user?.roles?.some((role: any) => requiredRoles.includes(role));

//     if (!hasRole) {
//       throw new ForbiddenException('No tines permiso para acceder aeste recurso');
//     }

//     return true;
//   }
// }


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
