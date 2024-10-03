import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AUTH_IS_PUBLIC_KEY } from "src/common/constants";
import { ROLES_KEYS } from "src/common/decorators/roles.decorator";
import { AuthExceptions } from "src/common/helpers/exceptions";
import { UserTypeEnum } from "src/users/enum/User.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserTypeEnum[]>(
      ROLES_KEYS,
      [context.getHandler(), context.getClass()]
      );
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AUTH_IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
        console.log('role is requires')
      return true;
    }
    if (isPublic) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const roleGuard = requiredRoles.some((role) => user.userType == role);
    if (!roleGuard) {
      throw AuthExceptions.UserNotAuthorizedAccess();
    } else {
      return roleGuard;
    }
  }
}
